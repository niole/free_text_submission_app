import { v4 } from 'uuid';
import { error, type RequestEvent } from '@sveltejs/kit';
import {findQuestionAnswerPair, createQuestionAnswerPair,  updateQuestionAnswerPair, listQuestionAnswerPairs } from '$lib/domain/models/questionAnswerPair';
import { handleTeacherRoute } from '$lib/utils';

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
export async function load(e: RequestEvent) {
    handleTeacherRoute(e);
    const pairId = e.url.searchParams.get('pairId');

    if (pairId) {
        try {
            const pair = await findQuestionAnswerPair(pairId)
            return { pair };
        } catch (e){
            console.error(`Couldn't retrieve queswtion answer pair ${pairId}`, e);
            error(404, 'Question not found');
        }
    }
    return {};
}
