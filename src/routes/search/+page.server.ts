import type { PageServerLoad } from './$types';
import { simpleSearchPromise } from './SimpleSearch';

export const load: PageServerLoad = async ({ url, fetch, locals: { session } }) => {
	const {
			featuredMode,
			searchTerm,
			page,
			search: s
		} = simpleSearchPromise(url.searchParams, session, fetch),
		params = new URLSearchParams(url.searchParams);
	params.delete('page');

	return {
		featuredMode,
		searchTerm,
		page,
		params: params.toString(),
		search: { s }
	};
};
