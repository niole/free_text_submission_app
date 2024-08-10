import { json } from '@sveltejs/kit'
import { getMetricsByEmail } from '$lib/domain/models/metric';
import { handleTeacherRoute } from '$lib/server/utils';

/**
 *  Lists all the metrics for a question for a user by email
 * 
 * @param event 
 * @returns 
 */
export async function GET(event) {
    await handleTeacherRoute(event);
    const { id, email } = event.params;
    const search = event.url.searchParams
    const sortKey = search.get('sortKey') ?? undefined;
    const sortDir = search.get('sortDir') ?? undefined;
    const query = search.get('q') ?? undefined;
    try {
        const metrics = await getMetricsByEmail(
            email,
            id,
            query,
            sortKey,
            sortDir as 'ASC' | 'DESC',
        );

        return json({ success: true, data: metrics });
    } catch (e) {
        console.error(`Failed to get metrics for email ${email} pairId ${id}`, e);
        return json({ success: false, data: [] });
    }

}