import { getCart } from '$lib/cart/getCart';
import type { LayoutServerLoad } from './$types';
export const load: LayoutServerLoad = async ({ locals: { session }, fetch }) => {
	const cart = getCart(session, fetch);

	return {
		cart,
		...session.stream([cart])
	};
};
