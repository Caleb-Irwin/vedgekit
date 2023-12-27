import type { RequestHandler } from './$types';
import { error, json } from '@sveltejs/kit';
import { getCart } from '$lib/cart/getCart';

export const GET: RequestHandler = async ({ locals: { session }, fetch }) => {
	try {
		return json(await getCart(session, fetch));
	} catch (e) {
		console.log(e);
		error(500, 'Failed to get cart');
		return new Response();
	}
};
