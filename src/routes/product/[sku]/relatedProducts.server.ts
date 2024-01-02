import type { SessionManager } from '$lib/session/server';
import { getItems } from './getItems';

export async function relatedProducts(
	session: SessionManager,
	categoryName: string,
	categoryLevel: number,
	customFetch: typeof fetch = fetch
) {
	const res = await session.req(
		'/getSkusFromSearch',
		{},
		{
			query: {
				cartId: null,
				userId: null,
				langId: null
			},
			customQuery: {
				langId: '-1',
				deptId: '0',
				categoryQuery: categoryName,
				catLevel: categoryLevel.toString(),
				resultsSize: '6',
				rowsPerPage: '6',
				solrRelevance: `random_${Math.floor(1000 + Math.random() * 9000)}+${
					['ASC', 'DESC'][Math.floor(Math.random() * 2)]
				}`
			}
		},
		customFetch
	);

	return await getItems(session, await res.json<string[]>(), customFetch);
}
