import { error } from '@sveltejs/kit';
import { getMetricsByEmail } from '$lib/domain/models/metric';
import { listQuestionAnswerPairs, findQuestionAnswerPair } from '$lib/domain/models/questionAnswerPair';
import { handleTeacherRoute } from '$lib/server/utils';
import { listStudents } from '$lib/domain/models/user';

export async function load(event) {
    await handleTeacherRoute(event)
    const search = event.url.searchParams;
    const email = search.get('email') ?? undefined;
    const id = search.get('id') ?? undefined;
    let question;

    if (id) {
        try {
            const pair = await findQuestionAnswerPair(id);
            question = pair?.question;
        } catch (e) {
            console.error(`Failed to get question pairId ${id}`, e);
        }
        }

    try {
        const metrics = email && id ? await getMetricsByEmail(email, id) : undefined;
        const students = (await listStudents()).map(s => s.email);
        const questions = await listQuestionAnswerPairs();
        return {
            students,
            questions,
            question,
            email,
            id,
            metrics
        };
    } catch (e) {
        console.error('Failed to get metrics', e);
        return error(500, 'Failed to get metrics');
    }
}