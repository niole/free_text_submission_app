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
    ownerId: string,
    question: string,
    answer: string,
};

export type UserModel = {
    id?: string,
    email: string,
};