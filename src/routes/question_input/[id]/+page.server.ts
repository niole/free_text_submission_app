import OpenAI from "openai";
import { type RequestEvent } from '@sveltejs/kit';
import { error } from '@sveltejs/kit';
import { type QuestionAnswerPairModel, findQuestionAnswerPair } from '$lib/domain/models/questionAnswerPair';

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
    submitAnswer: async (event: RequestEvent) => {
        const body = await event.request.formData();
        const answer = body.get('answer')?.toString();
        const id = body.get('id')?.toString();

        if (!id) {
            error(400, 'Missing id');
        }

        if (!answer) {
            error(400, 'Missing answer');
        }

        if (id && answer) {
            const pair = await findQuestionAnswerPair(id.toString());
            if (pair) {
                const completion = await openai.chat.completions.create({
                    messages: [{"role": "system", "content": createChatPrompt(pair)},
                        {"role": "user", "content": answer },
                    ],
                    model: "gpt-4o-mini",
                });
                const passed = getAssistentGrade(completion)
                if (passed !== null && passed) {
                    // TODO have a good response
                    return;
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
export async function load({ params }) {
    const { id } = params;
    const pair = await findQuestionAnswerPair(id.toString());

    if (pair) {
        return {
            question: pair.question,
            id: pair.id,
        };
    }

	error(404, 'Not found');
}