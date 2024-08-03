import cookie from 'cookie';

export class UnauthorizedError extends Error {}

export function getViewingUserEmail(event) {
    return cookie.parse(event.request.headers.get('cookie') ?? '').email;
}

export function handleTeacherRoute(event) {
    const sessionEmail = getViewingUserEmail(event);
    if (sessionEmail !== import.meta.env.VITE_TEACHER_EMAIL) {
        throw new UnauthorizedError('Unauthorized');
    }
}

export function getHumanReadableDate(date: string) {
    const d = new Date(date);
    return `${d.toLocaleDateString()} ${d.toLocaleTimeString()}`;
}
