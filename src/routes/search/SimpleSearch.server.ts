import type { SessionManager } from '$lib/session/server';
import { getFeatured } from '../api/home/featured.json/getFeatured';
import { search } from './Search.server';

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
		searchRes = (async () =>
			search(
				featuredMode
					? {
							page,
							rawQuery: (await getFeatured(customFetch))[
								parseInt(searchParams.get('featured') ?? '0')
							].originalSearch
					  }
					: {
							searchTerm: searchParams.get('query') ?? '',
							page
					  },
				session,
				customFetch
			))();

	return { search: searchRes, searchTerm, featuredMode, page };
}
