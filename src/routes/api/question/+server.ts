import { error, json } from '@sveltejs/kit'
import { listQuestionAnswerPairs } from '$lib/server/models/questionAnswerPair';
import { handleTeacherRoute } from '$lib/server/utils';

export async function GET(event) {
    console.debug('listing questions');
    await handleTeacherRoute(event);
    const search = event.url.searchParams
    const query = search.get('q') ?? undefined;
    try {
        const data = await listQuestionAnswerPairs(undefined, query);

        return json(data);
    } catch (e) {
        console.error(`Failed to get question answer pairs`, e);
        return error(500, 'Failed to get question answer pairs');
    }
}