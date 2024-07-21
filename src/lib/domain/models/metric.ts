import { MetricDbModel } from './db';

export type Metric = {
    /** the time the metric was created */
    createdAt: Date,
    /* the name of the metric */
    name: string,
    /** the subject is the actor who triggered the action */
    subjectLabel?: string,
    /** the target is what the action was done on */
    targetLabel?: string,
};

export async function createMetric(metric: Metric) {
    return await MetricDbModel.create(metric);
}

export async function listMetrics(query: Partial<Metric>) {
    return await MetricDbModel.findAll(query);
}

export function createViewQuestionMetric(viewingUser: string, pairId: string): Metric {
    return {
        createdAt: new Date(),
        name: 'ViewQuestion',
        subjectLabel: viewingUser,
        targetLabel: pairId,
    };
}

export function createAnswerQuestionMetric(viewingUser: string, pairId: string): Metric {
    return {
        createdAt: new Date(),
        name: 'AnswerQuestion',
        subjectLabel: viewingUser,
        targetLabel: pairId,
    };
}