import { v4 } from 'uuid';
import * as sequelize from 'sequelize';
import { defaultPageOpts, type PaginationPage, type PaginatedResponse, type QuestionAnswerPairModel } from '$lib/types';
import { QuestionAnswerPairDbModel } from './db';

export function createQuestionAnswerPair(pair: QuestionAnswerPairModel) {
    return QuestionAnswerPairDbModel.create({...pair, id: pair.id ?? v4() });
}

export async function updateQuestionAnswerPair(id: string, updates: Partial<QuestionAnswerPairModel>) {
    await QuestionAnswerPairDbModel
        .findOne({ where: { id } })
        .then(model => {
            if (model) {
                model.set(updates);
                return model.save();
            } else {
                throw new Error(`Could not find QuestionAnswerPair with id ${id}`);
            }
        });
}

export async function findQuestionAnswerPair(id: string): Promise<QuestionAnswerPairModel | null | undefined> {
    return QuestionAnswerPairDbModel.findOne({ where: { id } }).then(x => x?.toJSON());
}

export async function listQuestionAnswerPairs(
    ownerId?: string,
    query?: string,
    pageOpts: PaginationPage = defaultPageOpts
): Promise<PaginatedResponse<QuestionAnswerPairModel>> {
    const where = {};
    if (ownerId) {
        where.ownerId = ownerId;
    }

    if (query) {
        where.question = {
            [sequelize.Op.like]: `%${query}%`,
        };
        where.title = {
            [sequelize.Op.like]: `%${query}%`,
        };
    }
    const count = await QuestionAnswerPairDbModel.count({ where });

    const maxPage = Math.ceil(count / pageOpts.pageSize);
    const page = Math.min(Math.max(pageOpts.page, 1), maxPage);
    const offset = (page-1) * pageOpts.pageSize;
    const limit = pageOpts.pageSize;

    const data = await QuestionAnswerPairDbModel.findAll({
        where,
        offset,
        limit,
    }).then(x => x.map(y => y.toJSON()));
    return {
        pagination: {
            page: {
                page,
                pageSize: pageOpts.pageSize,
            },
            totalItems: count,
        },
        data,
    };
}

export function deleteQuestionAnswerPair(id: string): Promise<number> {
    // TODO do metrics get deleted too?
    return QuestionAnswerPairDbModel.destroy({ where: { id } });
}