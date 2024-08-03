import {google} from 'googleapis';
import {redirect, error as errorResponse} from '@sveltejs/kit';
import { jwtDecode } from "jwt-decode";
import cookie from 'cookie';
import { UnauthorizedError } from '$lib/utils';

const oauth2Client = new google.auth.OAuth2(
    import.meta.env.VITE_GOOGLE_CLIENT_ID,
    import.meta.env.VITE_GOOGLE_CLIENT_SECRET,
  'http://localhost:5173/oathcallback'
);

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
    const sessionEmail = cookie.parse(event.request.headers.get('cookie') ?? '').email;
    if (event.url.pathname.startsWith('/oathcallback')) {
        const code = event.url.searchParams.get('code');
        const {tokens} = await oauth2Client.getToken(code)
        const { email } = jwtDecode(tokens.id_token);

   
        const refreshSeconds = import.meta.env.VITE_COOKIE_REFRESH_SECONDS;
        return new Response('', {
            headers: new Headers({
                Location: '/',
                'Set-Cookie': `email=${email}; Max-Age=${refreshSeconds}`
            }),
            status: 302,
        });
    }
    if (!sessionEmail) {
        return redirect(302, url);
    }
    const response = await resolve(event);
    return response;
}

/** @type {import('@sveltejs/kit').Handle} */
export async function handleError({ error }) {
    if (error instanceof UnauthorizedError) {
        return errorResponse(403, 'You are not authorized to access this page');
    }
    return errorResponse(500, 'Something went wrong');
};