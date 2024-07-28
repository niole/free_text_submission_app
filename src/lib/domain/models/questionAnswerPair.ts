import { v4 } from 'uuid';
import { QuestionAnswerPairDbModel } from './db';

export type QuestionAnswerPairModel = {
    id?: string,
    ownerId: string,
    question: string,
    answer: string,
    link: string,
};

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

export function listQuestionAnswerPairs(ownerId: string): Promise<QuestionAnswerPairModel[]> {
    return QuestionAnswerPairDbModel.findAll({ where: { ownerId } }).then(x => x.map(y => y.toJSON()));
}

export function deleteQuestionAnswerPair(id: string): Promise<number> {
    return QuestionAnswerPairDbModel.destroy({ where: { id } });
}