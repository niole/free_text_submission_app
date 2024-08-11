import { json, error } from '@sveltejs/kit'
import { handleTeacherRoute } from '$lib/server/utils.js';
import { listStudents } from '$lib/domain/models/user';

export async function GET(event) {
    try {
        await handleTeacherRoute(event);
        return json({ success: true, data: await listStudents() });
    } catch (e) {
        console.error(`Failed to get students`, e);
        return error(500, e?.message);
    }
}