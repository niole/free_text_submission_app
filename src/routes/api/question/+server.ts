import { json } from '@sveltejs/kit'
import { listQuestionAnswerPairs } from '$lib/domain/models/questionAnswerPair';
import { handleTeacherRoute } from '$lib/server/utils';

export async function GET(event) {
    await handleTeacherRoute(event);
    const search = event.url.searchParams
    const query = search.get('q') ?? undefined;
    try {
        const data = await listQuestionAnswerPairs(undefined, query);

        return json({ success: true, data });
    } catch (e) {
        console.error(`Failed to get question answer pairs`, e);
        return json({ success: false, data: [] });
    }
}