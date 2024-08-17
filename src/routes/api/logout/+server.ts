export async function GET() {
    console.debug('logging user out');

    return new Response('', {
        headers: new Headers({
            Location: '/loggedout',
            'Set-Cookie': 'user=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;',
        }),
        status: 302,
    });

}