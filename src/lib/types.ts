import type { integrations_v1alpha } from "googleapis";

export type QuestionAnswerSummary = {
    email: string,
    title: string,
    questionId: string,
    correct?: boolean,
};

export type UserQuestionMetric = {
    name: string,
    createdAt: Date,
    question: string,
    email: string,
    answer?: string,
    correct?: boolean,
};

export type QuestionAnswerAnalysis = {
    question: string;
    answer: string;
    pairId: string;
    email: string;
    correct: boolean;
    totalVisits: number;
    totalTimeSpentMs: number;
    start: Date;
    end?: Date;
};

export type QuestionAnswerPairModel = {
    id?: string,
    title: string,
    ownerId: string,
    question: string,
    answer: string,
    successTeacherResponse?: string,
};

export type UserModel = {
    id?: string,
    email: string,
};

// 1 indexed
export type PaginationOpts = {
    totalItems: number,
    page: PaginationPage,
};

export type PaginationPage = {
    page: number,
    pageSize: number,
};
export const defaultPageOpts: PaginationPage = {
    page: 1,
    pageSize: 10,
};

export type PaginatedResponse<D> = {
    pagination: PaginationOpts,
    data: D[],
}

export const defaultPaginatedResponse = {
    data: [],
    pagination: {
        totalItems: 0,
        page: { page: 1, pageSize: 10},
    },
};
