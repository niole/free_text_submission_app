import { getAnalysis } from '$lib/domain/models/metric';
import { handleTeacherRoute } from '$lib/server/utils';

export async function load(event) {
    await handleTeacherRoute(event);
    return { metrics: await getAnalysis() };
}