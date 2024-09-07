import * as sequelize from 'sequelize';
import { MetricDbModel, QuestionAnswerPairDbModel, AnswerDbModel, UserDbModel } from './db';
import { type PaginatedResponse, type QuestionAnswerSummary, type QuestionAnswerAnalysis, type UserQuestionMetric } from '$lib/types';

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

export async function getMetricsByEmail(
    email: string,
    pairId: string,
    query?: string,
    sortKey: string = 'createdAt',
    sortDir: 'ASC' | 'DESC' = 'ASC',
): Promise<UserQuestionMetric[]> {

    type WhereClause = {
        email: string,
        pairId: string,
        name?: any,
        QuestionAnswerPair?: { question: any },
    };

    const where: WhereClause = {
        email,
        pairId,
    };

    const dbQuery = {
        where,

        order: [[sortKey, sortDir]],

        include: [
            QuestionAnswerPairDbModel,
            AnswerDbModel,
        ],
    };

    if (query) {
        const textSearchQuery = {
            [sequelize.Op.like]: `%${query}%`,
        };

        dbQuery.where.name = textSearchQuery;
    }

    const metrics = await MetricDbModel.findAll(dbQuery)

    return metrics.map(metric => {
        const m = metric.toJSON()
        const answer = m.name === 'AnswerQuestion' ?  m.Answer?.answer : undefined;
        return {
            name: m.name,
            createdAt: m.createdAt,
            question: m.QuestionAnswerPair?.question,
            email,
            answer,
            correct: m.Answer?.correct,
        };
    })
}

export async function getSummary(
    page: number,
    pageSize: number,
    email?: string,
    questionTitle?: string,
    questionId?: string,
): Promise<PaginatedResponse<QuestionAnswerSummary>> {
    const where: { email?: string } = {};

    if (email) {
        where.email = email;
    }

    if (questionId) {
        where["$QuestionAnswerPair.id$"] = questionId;
    }

    if (questionTitle) {
        where["$QuestionAnswerPair.title$"] = {
            [sequelize.Op.like]: `%${questionTitle}%`,
        };
    }

    const offset = (page-1)*pageSize;
    const limit = pageSize;

    const { count, rows } = await AnswerDbModel.findAndCountAll({
        where,
        group: ['QuestionAnswerPair.title'],
        include: [QuestionAnswerPairDbModel],
        offset,
        limit,
    })

    return {
        data: rows.map(x => {
            const j = x.toJSON()
            return {
                email: j.email,
                correct: j.correct,
                title: j.QuestionAnswerPair.title,
                questionId: j.QuestionAnswerPair.id,
            };
        }),
        pagination: {
            totalItems: count.length,
            page: { page, pageSize }
        }
    };
}

export async function getAnalysis(
    sortKey: string = 'createdAt',
    sortDir: 'ASC' | 'DESC' = 'ASC',
    query?: string,
): Promise<QuestionAnswerAnalysis[]> {
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

    // returns question answer pairs with a user's metrics, when they answered correctly, how long they spent, when they started
    // { question, userAnswer, pairId, email, correct, totalVisits, totalTimeSpentMinutes, start, end }
    const groupedAnswers = {};
    answers.forEach((x: any) => {
        const key = `${x.pairId} $(x.email}`;
        groupedAnswers[key] = (groupedAnswers[key] ?? []).concat(x);
    });

    startTimes.forEach((x: any) => {
        const key = `${x.pairId} $(x.email}`;
        groupedAnswers[key] = (groupedAnswers[key] ?? []).concat(x);
    });

    const results = Object.values(groupedAnswers).map((values: any[]) => {
        // get earliest ViewQuestion is when started
        const createdAsc = values.sort((a, b) => a.createdAt.getTime() - b.createdAt.getTime());
        const totalVisits = createdAsc.filter(x => x.name == 'ViewQuestion').length;
        const userAnswers = createdAsc.filter(x => x.name === 'AnswerQuestion');
        const correctAnswer = userAnswers.find(x => x?.Answer.correct);
        const totalTimeSpentMs = createdAsc[createdAsc.length-1].createdAt.getTime() - createdAsc[0].createdAt.getTime();
        return {
            question: createdAsc[0].QuestionAnswerPair.question,
            answer: correctAnswer?.Answer.answer,
            pairId: createdAsc[0].pairId,
            email: createdAsc[0].email,
            correct: !!correctAnswer,
            totalVisits: totalVisits,
            totalTimeSpentMs,
            start: createdAsc[0].createdAt,
            end: createdAsc[createdAsc.length-1].createdAt,
        };
    });

    const dateCols = ['start', 'end'];
    const sortByDateCol = dateCols.includes(sortKey);
    const sortableValueGetter = (x: any) => sortByDateCol ? x[sortKey].getTime() : x[sortKey];

    return results.sort((a, b) => {
        if (sortDir === 'ASC') {
            return sortableValueGetter(a) - sortableValueGetter(b);
        } else {
            return sortableValueGetter(b) - sortableValueGetter(a);
        }
    });
}
