import type { PageServerLoad } from './$types';

export const load: PageServerLoad = ({ params, url }) => {
	const minimal = url.searchParams.has('vedgekit-minimal');
	const newUrl = new URL(url);
	newUrl.searchParams.delete('vedgekit-minimal');

	return {
		path: params.path + newUrl.search,
		minimal
	};
};
