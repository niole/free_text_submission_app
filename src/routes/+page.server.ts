import { type RequestEvent } from '@sveltejs/kit';

let qs: { id: string, question: string, answer: string, link?: string }[] = [];

/** @type {import('./$types').Actions} */
export const actions = {
    saveQuestionAnswerPair: async (event: RequestEvent) => {
        const body = await event.request.formData();
        const question = body.get('question');
        const answer = body.get('answer');
        const pairId = body.get('pairId');

        if (question && answer) {

            if (pairId) {
                for (let i = 0; i < qs.length; i++) {
                    if (qs[i].id === pairId) {
                        qs[i].question = question.toString();
                        qs[i].answer = answer.toString();
                        break;
                    }
                }
            } else {
                const id = `${Math.random().toString()}-${Date.now()}`;
                qs.push({
                    id: id,
                    question: question.toString(),
                    answer: answer.toString(),
                    link: `https://example.com/answer/${id}`,
                });
            }
        }

        console.log(qs);
        return { qs };
    },

};

/** @type {import('./$types').PageLoad} */
export function load() {
    return { qs };
}
