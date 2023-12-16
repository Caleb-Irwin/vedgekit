export const prerender = true;

import type { RequestHandler } from './$types';
import { SessionManager } from '$lib/server/session';
import type { Cookies } from '@sveltejs/kit';

export const GET: RequestHandler = async () => {
	return new Response(JSON.stringify(_bannerImages, null, 2));
};

export const _bannerImages = await getBannerImages();

async function getBannerImages(
	cookies?: Cookies,
	customFetch?: typeof fetch
): Promise<BannerImages[]> {
	const session = new SessionManager(cookies, cookies !== undefined);
	await session.init();
	const res = await session.req(
		'/espots?espotName=Home_Dealer_Banner_Image&location=index.jsp',
		{},
		{},
		customFetch
	);
	const bannerAds: BannerAds = await res.json();
	const images: BannerImages[] = bannerAds.adContentValueDtos.map(({ image, url }, index) => {
		const imageUrl = `/api/home/${index}.jpeg`;
		return {
			imageUrl,
			originalUrl: image,
			searchUrl: url,
			index
		};
	});
	return images;
}

export interface BannerImages {
	imageUrl: string;
	searchUrl: string;
	originalUrl: string;
	index: number;
}

interface BannerAds {
	id: number;
	contentName: string;
	contentType: string;
	adContentValueDtos: AdContentValueDto[];
	count: number;
}

interface AdContentValueDto {
	image: string;
	url: string;
	type?: unknown;
	sku?: unknown;
	overlapText?: unknown;
	startDate?: unknown;
	endDate?: unknown;
	targetURL?: unknown;
	tagName: string;
	dynamicField?: unknown;
	buttonText?: unknown;
	itemInCart?: unknown;
	itemIsInCategory?: unknown;
	itemHasAttribute?: unknown;
}
