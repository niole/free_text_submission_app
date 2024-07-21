import { type RequestEvent } from '@sveltejs/kit';
import { error } from '@sveltejs/kit';
import { findQuestionAnswerPair } from '$lib/domain/models/questionAnswerPair';

/** @type {import('./$types').Actions} */
export const actions = {
    submitAnswer: async (event: RequestEvent) => {
        const body = await event.request.formData();
        const answer = body.get('answer');
        const id = body.get('id');

        if (!id) {
            error(400, 'Missing id');
        }

        if (!answer) {
            error(400, 'Missing answer');
        }

        if (id && answer) {
            const pair = await findQuestionAnswerPair(id.toString());
            if (pair) {
                if (answer.toString() === pair.answer) {
                    return;
                } else {
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