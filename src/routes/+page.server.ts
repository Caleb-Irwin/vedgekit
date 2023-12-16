import type { PageServerLoad } from './$types';
import type { BannerImages } from './api/home/featured.json/+server';

export const load: PageServerLoad = async ({ fetch }) => {
	const res = await fetch('/api/home/featured.json');
	return {
		bannerImages: res.status === 200 ? ((await res.json()) as BannerImages[]) : undefined
	};
};
