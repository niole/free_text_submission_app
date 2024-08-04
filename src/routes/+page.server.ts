import { listQuestionAnswerPairs } from '$lib/domain/models/questionAnswerPair';
import { handleTeacherRoute } from '$lib/server/utils';

/** @type {import('./$types').PageLoad} */
export async function load(event) {
    await handleTeacherRoute(event);
    return { qs: await listQuestionAnswerPairs('me')};
}
