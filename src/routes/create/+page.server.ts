import { v4 } from 'uuid';
import { error, type RequestEvent } from '@sveltejs/kit';
import {findQuestionAnswerPair, createQuestionAnswerPair,  updateQuestionAnswerPair, listQuestionAnswerPairs } from '$lib/domain/models/questionAnswerPair';
import { getTeacher } from '$lib/domain/models/user';
import { handleTeacherRoute } from '$lib/server/utils';

/** @type {import('./$types').Actions} */
export const actions = {
    saveQuestionAnswerPair: async (event: RequestEvent) => {
        await handleTeacherRoute(event)
        const body = await event.request.formData();
        const question = body.get('question')?.toString();
        const answer = body.get('answer')?.toString();
        const pairId = body.get('pairId')?.toString();

        const teacher = await getTeacher();
        if (!teacher) {
            return error(500, 'Teacher not found');
        }

        const teacherId = teacher.id;
        if (question && answer) {

            if (pairId) {
                await updateQuestionAnswerPair(pairId, { question, answer });
            } else {
                const id = v4();
                await createQuestionAnswerPair({
                    id,
                    ownerId: teacherId,
                    question,
                    answer,
                });
            }
        }

        return { qs: await listQuestionAnswerPairs(teacherId)};
    },

};

/** @type {import('./$types').PageLoad} */
export async function load(e: RequestEvent) {
    await handleTeacherRoute(e);
    const pairId = e.url.searchParams.get('pairId');

    if (pairId) {
        try {
            const pair = await findQuestionAnswerPair(pairId)
            return { pair };
        } catch (e){
            console.error(`Couldn't retrieve question answer pair ${pairId}`, e);
            error(404, 'Question not found');
        }
    }
    return {};
}
