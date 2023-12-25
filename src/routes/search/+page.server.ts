import { SessionManager } from '$lib/server/session';
import { getFeatured } from '../api/home/featured.json/getFeatured';
import type { PageServerLoad } from './$types';
import { search } from './Search.server';

export const load: PageServerLoad = async ({ url, fetch, cookies }) => {
	const session = new SessionManager(cookies);

	await session.init();
	return {
		path: `/search.do?searchTerm=${url.searchParams.get('query')}&cc={vStoreId}&langId={lang}`,
		featuredMode: url.searchParams.has('featured'),
		searchTerm: url.searchParams.get('featured') ?? url.searchParams.get('query'),
		search: {
			s: search(
				url.searchParams.has('featured')
					? {
							page: parseInt(url.searchParams.get('page') ?? ''),
							rawQuery: (await getFeatured(fetch))[
								parseInt(url.searchParams.get('featured') ?? '0')
							].originalSearch
					  }
					: {
							searchTerm: url.searchParams.get('query') ?? '',
							page: parseInt(url.searchParams.get('page') ?? '')
					  },
				session,
				fetch
			)
		}
	};
};
