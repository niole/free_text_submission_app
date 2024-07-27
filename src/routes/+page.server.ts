import { listQuestionAnswerPairs } from '$lib/domain/models/questionAnswerPair';

/** @type {import('./$types').PageLoad} */
export async function load() {
    return { qs: await listQuestionAnswerPairs('me')};
}
