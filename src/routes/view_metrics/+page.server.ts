import { getAnalysis } from '$lib/domain/models/metric';

export async function load() {
    return { metrics: await getAnalysis() };
}