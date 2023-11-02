import type { PageServerLoad } from './$types';

export const load: PageServerLoad = ({ params, url }) => {
	return {
		path: params.path + url.search
	};
};
