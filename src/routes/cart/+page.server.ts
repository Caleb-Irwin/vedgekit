import { getCart } from '$lib/cart/getCart';
import type { Actions, PageServerLoad } from './$types';
import { getCartId } from '$lib/cart/getCartId';
import { error } from '@sveltejs/kit';

export const load: PageServerLoad = async ({ locals: { session }, fetch }) => {
	const cart = getCart(session, fetch);

	return { cart, ...session.stream([cart]) };
};

export const actions = {
	add: async ({ locals: { session }, request, fetch }) => {
		await session.ready;
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
		if (res.status !== 200) error(500, `Failed to get cart id (status = ${res.status})`);
		const resObj = (await res.json()) as { cartId: number };
		if (resObj.cartId) await session.update({ vCartId: resObj.cartId.toString() });
		return {
			raw: resObj
		};
	},
	remove: async ({ locals: { session }, request, fetch }) => {
		await session.ready;
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
