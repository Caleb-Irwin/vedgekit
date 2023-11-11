import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ url }) => {
	return {
		path: `/search.do?searchTerm=${url.searchParams.get('query')}&cc={vStoreId}&langId={lang}`
	};
};
