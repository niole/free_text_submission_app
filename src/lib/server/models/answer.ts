import { v4 } from 'uuid';
import { AnswerDbModel } from './db';

export type Answer = {
    createdAt: Date,
    id?: string,
    pairId: string,
    email: string,
    answer: string,
    correct: boolean,
};

export async function createAnswer(answer: Answer): Promise<Answer> {
    return AnswerDbModel.create({...answer, id: v4() }).then(x => x.toJSON());
}