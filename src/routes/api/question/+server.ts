import { error, json } from '@sveltejs/kit'
import { listQuestionAnswerPairs } from '$lib/server/models/questionAnswerPair';
import { handleTeacherRoute } from '$lib/server/utils';

export async function GET(event) {
    console.debug('listing questions');
    await handleTeacherRoute(event);
    const search = event.url.searchParams
    const pageSize = search.get('pageSize') ?? undefined;
    const page = search.get('page') ?? undefined;
    const query = search.get('q') ?? undefined;

    let pageOpts;
    if (pageSize && page) {
        pageOpts = { page, pageSize };
    }
    try {
        const data = await listQuestionAnswerPairs(undefined, query, pageOpts);

        return json(data);
    } catch (e) {
        console.error(`Failed to get question answer pairs`, e);
        return error(500, 'Failed to get question answer pairs');
    }
}
