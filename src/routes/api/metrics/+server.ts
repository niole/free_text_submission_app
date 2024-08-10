import { json } from '@sveltejs/kit'
import { getAnalysis } from '$lib/domain/models/metric';
import { handleTeacherRoute } from '$lib/server/utils';

export async function GET(event) {
    await handleTeacherRoute(event);
    const search = event.url.searchParams
    const sortKey = search.get('sortKey') ?? undefined;
    const sortDir = search.get('sortDir') ?? undefined;
    const query = search.get('q') ?? undefined;
    try {
        const metrics = await getAnalysis(sortKey, sortDir as 'ASC' | 'DESC', query);
        return json({ success: true, data: metrics });
    } catch (e) {
        console.error(`Failed to get metrics`, e);
        return json({ success: false, data: [] });
    }
}