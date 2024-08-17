import {google} from 'googleapis';
import cookie from 'cookie';
import { jwtDecode } from "jwt-decode";
import {
    GOOGLE_CLIENT_ID,
    GOOGLE_CLIENT_SECRET,
    ADMIN_EMAIL,
    TEACHER_EMAIL,
} from '$env/static/private';

export const oauth2Client = new google.auth.OAuth2(
    GOOGLE_CLIENT_ID,
    GOOGLE_CLIENT_SECRET,
    `${import.meta.env.VITE_APP_DOMAIN}/oathcallback`,
);

export class UnauthorizedError extends Error {}
export class UnauthenticatedError extends Error {}

export async function getVerifiedUser(event): Promise<string> {
    const { user } = cookie.parse(event.request.headers.get('cookie') ?? '');

    try {
        if (!user) {
            throw new UnauthenticatedError('No user cookie');
        }
        const token = jwtDecode(user);
        // verify
        await oauth2Client.verifyIdToken({ audience: token.aud, idToken: user});
    } catch (e) {
        console.error('Failed to verify token', e);
        throw new UnauthenticatedError();
    }

    return user;
}

export async function getViewingUserEmail(event): Promise<string> {
    const user = await getVerifiedUser(event);
    return jwtDecode(user).email;
}

export async function handleTeacherRoute(event): Promise<string> {
    const sessionEmail = await getViewingUserEmail(event);
    const allowedEmails = [ADMIN_EMAIL, TEACHER_EMAIL];
    if (!allowedEmails.includes(sessionEmail)) {
        throw new UnauthorizedError('Unauthorized');
    }
    return sessionEmail;
}
