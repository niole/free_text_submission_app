import { error } from '@sveltejs/kit';
import { getMetricsByEmail } from '$lib/server/models/metric';
import { findQuestionAnswerPair } from '$lib/server/models/questionAnswerPair';
import { handleTeacherRoute } from '$lib/server/utils';

export async function load(event) {
    await handleTeacherRoute(event)
    const search = event.url.searchParams;
    const email = search.get('email') ?? undefined;
    const id = search.get('id') ?? undefined;
    let pair;

    if (id) {
        try {
            pair = await findQuestionAnswerPair(id);
        } catch (e) {
            console.error(`Failed to get question pairId ${id}`, e);
        }
    }

    try {
        const metrics = email && id ? await getMetricsByEmail(email, id) : undefined;
        return {
            questionTitle: pair?.title,
            question: pair?.question,
            email,
            id,
            metrics
        };
    } catch (e) {
        console.error('Failed to get metrics', e);
        return error(500, 'Failed to get metrics');
    }
}
