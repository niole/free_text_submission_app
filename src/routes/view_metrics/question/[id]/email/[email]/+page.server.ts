import { getMetricsByEmail } from '$lib/domain/models/metric';
import { findQuestionAnswerPair } from '$lib/domain/models/questionAnswerPair';

export async function load({ params }) {
    const { email, id } = params;
    let question;
    try {
        const pair = await findQuestionAnswerPair(id);
        question = pair?.question;
    } catch (e) {
        console.error(`Failed to get question pairId ${id}`, e);
    }

    try {
        const metrics = await getMetricsByEmail(email, id);
        return { question, email, id, metrics };
    } catch (e) {
        console.error(`Failed to get metrics for email ${email} pairId ${id}`, e);
        return { question, email, id, metrics: [] };
    }
}