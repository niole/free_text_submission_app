import {redirect, error as errorResponse} from '@sveltejs/kit';
import { getVerifiedUser, oauth2Client, UnauthenticatedError, UnauthorizedError } from '$lib/server/utils';

const scope = [
  'https://www.googleapis.com/auth/userinfo.email',
  'https://www.googleapis.com/auth/userinfo.profile',
];

const url = oauth2Client.generateAuthUrl({
  // 'online' (default) or 'offline' (gets refresh_token)
  access_type: 'offline',

  // If you only need one scope, you can pass it as a string
  scope
});

/** @type {import('@sveltejs/kit').Handle} */
export async function handle({ event, resolve }) {
    if (event.url.pathname.startsWith('/oathcallback')) {
        const code = event.url.searchParams.get('code');
        const {tokens} = await oauth2Client.getToken(code)
   
        const refreshSeconds = import.meta.env.VITE_COOKIE_REFRESH_SECONDS;
        return new Response('', {
            headers: new Headers({
                Location: '/',
                'Set-Cookie': `user=${tokens.id_token}; Max-Age=${refreshSeconds}`
            }),
            status: 302,
        });
    }

    try {
        await getVerifiedUser(event);
    } catch (error) {
        console.error('Failed to verify user: ', error);
        if (error instanceof UnauthenticatedError) {
            // initiate login flow
            return redirect(302, url);
        }
    }

    const response = await resolve(event);
    return response;
}

/** @type {import('@sveltejs/kit').Handle} */
export async function handleError({ error }) {
    console.error(error);

    if (error instanceof UnauthorizedError) {
        return errorResponse(403, 'You are not authorized to access this page');
    }
    return errorResponse(500, 'Something went wrong');
};