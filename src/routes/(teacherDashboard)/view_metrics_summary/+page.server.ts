import { error, type RequestEvent } from '@sveltejs/kit';
import { getSummary } from '$lib/server/models/metric';
import { handleTeacherRoute } from '$lib/server/utils';

export async function load(event) {
    await handleTeacherRoute(event)
    try {
        return await getSummary(1, 10);
    } catch (e) {
        console.error('Failed to get metrics', e);
        return error(500, 'Failed to get metrics');
    }
}

/** @type {import('./$types').Actions} */
export const actions = {
    getSummary: async (event: RequestEvent) => {
        await handleTeacherRoute(event)
        const body = await event.request.formData();
        const email = body.get('email');
        const title = body.get('title');
        const questionId = body.get('questionId');
        const page = parseInt(body.get('page')?.toString() ?? '1');
        const pageSize = parseInt(body.get('pageSize')?.toString() ?? '10');

        return await getSummary(
            page,
            pageSize,
            email,
            title,
            questionId,
        );
    },
};

