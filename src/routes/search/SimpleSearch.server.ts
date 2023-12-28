import type { ListItem } from '$lib/itemList/listItem';
import type { SessionManager } from '$lib/session/server';
import { getFeatured } from '../api/home/featured.json/getFeatured';
import { search } from './Search.server';

export interface Search {
	totalItems: number;
	items: ListItem[];
}

export async function simpleSearch(
	searchParams: URLSearchParams,
	session: SessionManager,
	customFetch: typeof fetch = fetch
) {
	const res = simpleSearchPromise(searchParams, session, customFetch);
	return { ...res, search: await res.search };
}

export function simpleSearchPromise(
	searchParams: URLSearchParams,
	session: SessionManager,
	customFetch: typeof fetch = fetch
) {
	const page = parseInt(searchParams.get('page') ?? '0'),
		featuredMode = searchParams.has('featured'),
		searchTerm = searchParams.get('featured') ?? searchParams.get('query'),
		searchRes = (async (): Promise<Search> => {
			const res = await search(
				featuredMode
					? {
							page,
							rawQuery: (
								await getFeatured(customFetch)
							)[parseInt(searchParams.get('featured') ?? '0')].originalSearch
					  }
					: {
							searchTerm: searchParams.get('query') ?? '',
							page
					  },
				session,
				customFetch
			);
			return {
				totalItems: res.searchResults.productCount,
				items: res.searchResults.solrProducts.map((item) => ({
					productUrl: `/product/${encodeURIComponent(item.partnumber)}`,
					imageUrl: item.basicsItems[0].listViewImgURL,
					productNumber: item.partnumber,
					name: item.name,
					price: item.basicsItems[0].price,
					uom: item.basicsItems[0].selling_UOM,
					inStock: !item.basicsItems[0].outOfStock,
					saleItem: item.onSale,
					raw: item
				}))
			};
		})();

	return { search: searchRes, searchTerm, featuredMode, page };
}
