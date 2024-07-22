import * as sequelize from 'sequelize';
import { MetricDbModel, QuestionAnswerPairDbModel, AnswerDbModel, UserDbModel } from './db';

export type Metric = {
    /** the time the metric was created */
    createdAt: Date,
    /* the name of the metric */
    name: string,

    userId?: string,
    answerId?: string,
    pairId?: string,
    email?: string,
};

export async function createMetric(metric: Metric) {
    return await MetricDbModel.create(metric);
}

export async function listMetrics(query: Partial<Metric>) {
    return await MetricDbModel.findAll({ where: query });
}

export function createViewQuestionMetric(viewingUser: string, pairId: string): Metric {
    return {
        createdAt: new Date(),
        name: 'ViewQuestion',
        pairId,
        email: viewingUser,
    };
}

export function createAnswerQuestionMetric(viewingUser: string, pairId: string, answerId: string): Metric {
    return {
        createdAt: new Date(),
        name: 'AnswerQuestion',
        pairId,
        email: viewingUser,
        answerId,
    };
}

type QuestionAnswerAnalysis = {
    question: string;
    answer: string;
    pairId: string;
    email: string;
    correct: boolean;
    totalVisits: number;
    totalTimeSpentMinutes: number;
    start?: Date;
    end?: Date;
};

export async function getAnalysis(): Promise<QuestionAnswerAnalysis[]> {
    // user time spent on question and user answer and question
    const startTimes = await MetricDbModel.findAll({
        where: {
            name: 'ViewQuestion',
        },

        attributes: {
            include: [
                [sequelize.fn('MIN', sequelize.col('Metric.createdAt')), 'start'],
            ],
        },

        group: ['Metric.email', 'Metric.pairId'],

        include: [
            QuestionAnswerPairDbModel,
            AnswerDbModel,
            UserDbModel,
        ],
    });
    const answers = await MetricDbModel.findAll({
        where: {
            name: 'AnswerQuestion',
        },

        attributes: {
            include: [
                [sequelize.fn('MIN', sequelize.col('Metric.createdAt')), 'start'],
                [sequelize.fn('MAX', sequelize.col('Metric.createdAt')), 'end'],
            ],
        },

        group: ['Metric.email', 'Metric.pairId'],

        include: [
            QuestionAnswerPairDbModel,
            AnswerDbModel,
            UserDbModel,
        ],
    });
    console.log(answers.length);
    console.log(answers.map(x => x.toJSON()));
    console.log(startTimes.map(x => x.toJSON()));

    return [];
}