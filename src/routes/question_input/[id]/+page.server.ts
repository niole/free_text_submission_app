import OpenAI from "openai";
import { type RequestEvent } from '@sveltejs/kit';
import { error, redirect } from '@sveltejs/kit';
import { type QuestionAnswerPairModel, findQuestionAnswerPair } from '$lib/domain/models/questionAnswerPair';
import { createAnswerQuestionMetric, createMetric, createViewQuestionMetric } from '$lib/domain/models/metric';
import { createAnswer } from '$lib/domain/models/answer';
import { getViewingUserEmail } from '$lib/server/utils';

const openai = new OpenAI({ apiKey: import.meta.env.VITE_OPENAI_KEY });

const DEFAULT_CHAT_PROMPT = `
you are a math problem grader. Given a problem and an answer, please grade the answer that the student subsequently sends to you.
If the answer that the student sends can be refactored such that it's equal to the answer, consider it to be correct.
DO NOT GIVE THE ANSWER. wait for the student to submit an answer and then respond with "correct" or "incorrect".
`;

function createChatPrompt(pair: QuestionAnswerPairModel) {
    return `
        ${DEFAULT_CHAT_PROMPT}
        QUESTION: ${pair.question}
        ANSWER: ${pair.answer}
    `;
}

function getAssistentGrade(completion: any): boolean | null {
    if (completion.choices.length) {
        return completion.choices[0].message.content === 'correct';
    }
    return null;
}

/** @type {import('./$types').Actions} */
export const actions = {
    handlePageVisit: async (event: RequestEvent) => {
        const body = await event.request.formData();
        const viewingUser = await getViewingUserEmail(event);
        const id = body.get('id')?.toString();

        if (!id) {
            error(400, 'Missing question id');
        }

        if (!viewingUser) {
            error(400, 'Missing viewing user information');
        }

        const viewPageMetric = createViewQuestionMetric(viewingUser, id);
        createMetric(viewPageMetric);
    },

    submitAnswer: async (event: RequestEvent) => {
        const body = await event.request.formData();
        const answer = body.get('answer')?.toString();
        const id = body.get('id')?.toString();
        const email = await getViewingUserEmail(event);

        if (!email) {
            error(400, 'Missing email');
        }

        if (!id) {
            error(400, 'Missing id');
        }

        if (!answer) {
            error(400, 'Missing answer');
        }

        if (id && answer) {
            const pair = await findQuestionAnswerPair(id);
            if (pair) {
                const completion = await openai.chat.completions.create({
                    messages: [{"role": "system", "content": createChatPrompt(pair)},
                        {"role": "user", "content": answer },
                    ],
                    model: "gpt-4o-mini",
                });
                const passed = getAssistentGrade(completion)

                const correct = passed !== null && passed;
                const submission = {
                    createdAt: new Date(),
                    pairId: pair.id!,
                    email,
                    answer,
                    correct,
                };
                const userAnswer = await createAnswer(submission);
                createMetric(createAnswerQuestionMetric(email, pair.id, userAnswer.id));

                if (passed !== null && passed) {
                    return redirect(302, '/correct');
                } else {
                    if (passed === null) {
                        console.error(`Chat assistant gave inscrutible answer: ${JSON.stringify(completion)}`);
                    }
                    error(400, 'Incorrect answer');
                }

            }
        }

        error(404, 'Question not found');
    },

};

/** @type {import('./$types').PageLoad} */
export async function load(event) {
    const { params } = event;

    const id = params.id?.toString();
    const pair = await findQuestionAnswerPair(id);

    if (pair) {
        return {
            question: pair.question,
            id: pair.id,
        };
    }

	error(404, 'Not found');
}