import type { PageServerLoad } from './$types';
import { getFeatured } from './api/home/featured.json/getFeatured';

export const load: PageServerLoad = async ({ fetch }) => {
	return {
		bannerImages: await getFeatured(fetch)
	};
};
