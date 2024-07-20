import { error } from '@sveltejs/kit';

// TODO get qs
let qs = [];

/** @type {import('./$types').PageLoad} */
export function load({ params }) {
    const { id } = params;
    const pair = qs.find(q => q.id === id);

    if (pair) {
        return pair;
    }

	error(404, 'Not found');
}