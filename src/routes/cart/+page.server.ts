import { getCart } from '$lib/cart/getCart';
import { SessionManager } from '$lib/server/session';

import type { Actions, PageServerLoad } from './$types';
import { getCartId } from '$lib/cart/getCartId';
import { error } from '@sveltejs/kit';

export const load: PageServerLoad = async ({ cookies, parent, fetch }) => {
	const session = new SessionManager(cookies, false);

	const cart = (async () => {
			await session.init((await (await parent()).streamed.session).jwt);
			return getCart(session, fetch);
		})(),
		jwt = (async () => {
			const initialSession = cookies.get('session');
			await cart;
			return initialSession !== session.JWT ? session.JWT : undefined;
		})();

	return { c: { cart }, s: { jwt } };
};

export const actions = {
	add: async ({ cookies, request, fetch }) => {
		const session = new SessionManager(cookies);
		await session.init();
		if (session.s.vCartId === null) {
			await getCartId(session, fetch);
		}

		const form = await request.formData();
		const sku = form.get('sku')?.toString(),
			quantity = parseInt(form.get('quantity')?.toString() ?? '1');

		const res = await session.req(
			'/addItemToCart',
			{},
			{
				customQuery: {
					skus: sku ?? '',
					quantities: quantity.toString() ?? '1'
				}
			},
			fetch
		);
		if (res.status !== 200) throw error(500, `Failed to get cart id (status = ${res.status})`);
		const resObj = (await res.json()) as { cartId: number };
		if (resObj.cartId) await session.updateSession({ vCartId: resObj.cartId.toString() });

		return {
			raw: resObj
		};
	},
	remove: async ({ cookies, request, fetch }) => {
		const session = new SessionManager(cookies);
		await session.init();
		if (session.s.vCartId === null) {
			await getCartId(session, fetch);
		}
		const form = await request.formData();
		const res = await session.req(
			'/removeCartItem',
			{},
			{ customQuery: { cartItemId: form.get('cartItemId')?.toString() ?? '' } }
		);

		return {
			raw: await res.json()
		};
	}
	// , itemNote: async ({ cookies, request, fetch }) => {
	// 	//TODO
	// }
	// , orderNote: async ({ cookies, request, fetch }) => {
	// 	//TODO
	// }
	// , coupon: async ({ cookies, request, fetch }) => {
	// 	//TODO
	// }
} satisfies Actions;
