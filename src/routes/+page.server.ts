import { listQuestionAnswerPairs } from '$lib/domain/models/questionAnswerPair';
import { handleTeacherRoute } from '$lib/utils';

/** @type {import('./$types').PageLoad} */
export async function load(event) {
    handleTeacherRoute(event);
    return { qs: await listQuestionAnswerPairs('me')};
}
