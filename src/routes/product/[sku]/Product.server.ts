import type { SessionManager } from '$lib/session/server';
import type { ProductRes } from './ProductRes.server';

export async function getProduct(
	sku: string,
	session: SessionManager,
	customFetch?: typeof fetch
): Promise<ProductRes> {
	const res = await session.req(
		'/productDetailInfo',
		{},
		{
			customQuery: {
				sku
			}
		},
		customFetch
	);
	return await res.json<ProductRes>();
}
