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
        const students = (await listStudents()).map(s => s.email);
        const questions = await listQuestionAnswerPairs();
        return {
            questionTitle: pair?.title,
            students,
            questions,
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