import type { RequestHandler } from './$types';
import { SessionManager } from '$lib/server/session';
import { error, json } from '@sveltejs/kit';
import { getCart } from '$lib/cart/getCart';

export const GET: RequestHandler = async ({ cookies, fetch }) => {
	const session = new SessionManager(cookies);
	await session.init();

	try {
		return json(await getCart(session, fetch));
	} catch (e) {
		console.log(e);
		throw error(500, 'Failed to get cart');
	}
};
