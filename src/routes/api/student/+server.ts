import { json, error } from '@sveltejs/kit'
import { handleTeacherRoute } from '$lib/server/utils.js';
import { listStudents } from '$lib/server/models/user';

export async function GET(event) {
    console.debug('list students');
    const search = event.url.searchParams;
    const q = search.get('q') ?? undefined;

    try {
        await handleTeacherRoute(event);
        return json({ success: true, data: await listStudents(10, q) });
    } catch (e) {
        console.error(`Failed to get students`, e);
        return error(500, e?.message);
    }
}