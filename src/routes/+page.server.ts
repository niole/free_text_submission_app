import { v4 } from 'uuid';
import { type RequestEvent } from '@sveltejs/kit';
import {createQuestionAnswerPair,  updateQuestionAnswerPair, listQuestionAnswerPairs } from '$lib/domain/models/questionAnswerPair';

const APP_DOMAIN = import.meta.env.VITE_APP_DOMAIN;

/** @type {import('./$types').Actions} */
export const actions = {
    saveQuestionAnswerPair: async (event: RequestEvent) => {
        const body = await event.request.formData();
        const question = body.get('question')?.toString();
        const answer = body.get('answer')?.toString();
        const pairId = body.get('pairId')?.toString();

        if (question && answer) {

            if (pairId) {
                await updateQuestionAnswerPair(pairId, { question, answer });
            } else {
                const id = v4();
                await createQuestionAnswerPair({
                    id,
                    ownerId: 'me',
                    question,
                    answer,
                    link: `${APP_DOMAIN}/question_input/${id}`,
                });
            }
        }

        return { qs: await listQuestionAnswerPairs('me')};
    },

};

/** @type {import('./$types').PageLoad} */
export async function load() {
    return { qs: await listQuestionAnswerPairs('me')};
}
