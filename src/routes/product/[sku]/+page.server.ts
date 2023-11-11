import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ params }) => {
	return {
		path: `/productdetails.do?sku=${params.sku}&cc={vStoreId}&langId={lang}`
	};
};
