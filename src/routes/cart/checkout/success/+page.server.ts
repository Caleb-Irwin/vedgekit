import type { PageServerLoad } from './$types';
import { getCart } from '$lib/cart/getCart';

export const load: PageServerLoad = async ({ locals: { session }, fetch, url }) => {
	await session.init(undefined, 'new', true);
	const cart = getCart(session, fetch, true);

	return {
		number: url.searchParams.get('number'),
		cart,
		...session.stream([cart])
	};
};
