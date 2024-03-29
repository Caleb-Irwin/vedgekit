import type { SessionManager } from '$lib/session/server';

export const getCartId = async (
	session: InstanceType<typeof SessionManager>,
	internalFetch: typeof fetch
): Promise<number> => {
	const res = await session.req(
		'/getCartSession',
		{ method: 'POST' },
		{ query: null },
		internalFetch
	);
	if (res.status !== 200) throw new Error(`Failed to get cart id (status = ${res.status})`);
	const { cartId, status } = (await res.json()) as { cartId: number; status: string };
	if (status === 'SUCCESS') {
		await session.update({ vCartId: cartId.toString() });
		return cartId;
	} else throw new Error('Failed to get cart id');
};
