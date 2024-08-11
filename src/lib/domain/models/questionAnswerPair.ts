import { v4 } from 'uuid';
import * as sequelize from 'sequelize';
import { type QuestionAnswerPairModel } from '$lib/types';
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

export function listQuestionAnswerPairs(ownerId?: string, query?: string): Promise<QuestionAnswerPairModel[]> {
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
    return QuestionAnswerPairDbModel.findAll({ where }).then(x => x.map(y => y.toJSON()));
}

export function deleteQuestionAnswerPair(id: string): Promise<number> {
    // TODO do metrics get deleted too?
    return QuestionAnswerPairDbModel.destroy({ where: { id } });
}