import { error } from '@sveltejs/kit';
import { listQuestionAnswerPairs } from '$lib/domain/models/questionAnswerPair';
import { getTeacher } from '$lib/domain/models/user';
import { handleTeacherRoute } from '$lib/server/utils';

/** @type {import('./$types').PageLoad} */
export async function load(event) {
    await handleTeacherRoute(event);
    const teacher = await getTeacher();
    if (!teacher) {
        return error(500, 'Teacher not found');
    }
    return { qs: await listQuestionAnswerPairs(teacher.id)};
}
