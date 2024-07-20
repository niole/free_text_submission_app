import { type RequestEvent } from '@sveltejs/kit';
import { error } from '@sveltejs/kit';

// TODO get qs
let qs: { id: string, question: string, answer: string, link?: string }[] = [];

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
            const pair = qs.find(q => q.id === id);
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
export function load({ params }) {
    const { id } = params;
    const pair = qs.find(q => q.id === id);

    if (pair) {
        return {
            question: pair.question,
            id: pair.id,
        };
    }

    return {
        question: 'what is the answer to life, the universe, and everything?',
        id: "sdf",
    };
	//error(404, 'Not found');
}