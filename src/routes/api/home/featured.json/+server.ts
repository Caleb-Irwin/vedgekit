export const prerender = true;

import type { RequestHandler } from './$types';
import { SessionManager } from '$lib/server/session';
import type { Cookies } from '@sveltejs/kit';

export const GET: RequestHandler = async ({ fetch, cookies }) => {
	return new Response(JSON.stringify(await _getBannerImages(cookies, fetch), null, 2));
};

export async function _getBannerImages(
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
	const images: BannerImages[] = bannerAds.adContentValueDtos.map(({ image, url }) => {
		const imgParam = encodeURIComponent(image).replaceAll('.', '%2E');
		const imageUrl = `/api/home/${imgParam}.jpeg`;
		return {
			imageUrl,
			imgParam,
			searchUrl: url
		};
	});
	return images;
}

export interface BannerImages {
	imageUrl: string;
	searchUrl: string;
	imgParam: string;
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
