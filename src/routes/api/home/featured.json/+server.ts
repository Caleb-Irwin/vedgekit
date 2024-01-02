export const prerender = true;

import type { RequestHandler } from './$types';
import { SessionManager } from '$lib/session/server';
import type { ListItem } from '$lib/itemList/listItem';
import { getItems } from '../../../product/[sku]/getItems';

export const GET: RequestHandler = async () => {
	return new Response(JSON.stringify(_featured satisfies Featured, null, 2));
};

export const _featured = await getFeatured();
export const _bannerImages = _featured.bannerImages;
export const _featuredProducts = _featured.featuredProducts;

async function getFeatured(): Promise<Featured> {
	const session = new SessionManager(undefined, false);
	await session.init();
	const res = await session.req('/espots?espotName=Home_Dealer_Banner_Image&location=index.jsp');
	const bannerAds: BannerAds = await res.json();
	const bannerImages: BannerImages[] = bannerAds.adContentValueDtos.map(({ image, url }, index) => {
		const imageUrl = `/api/home/${index}.jpeg`;
		return {
			imageUrl,
			originalUrl: image,
			originalSearch: Object.fromEntries(new URL('http://localhost/' + url).searchParams.entries()),
			searchUrl: url,
			index
		};
	});

	const pRes = await session.req('/espots?espotName=Home_Dealer_Product_Images&location=index.jsp');
	const productSkus = ((await pRes.json()) as DealerFeatured).adContentValueDtos.map(({ sku }) =>
		encodeURIComponent(sku as string)
	);

	const featuredProducts = await getItems(session, productSkus, fetch, true);

	return { bannerImages, featuredProducts };
}
export interface Featured {
	bannerImages: BannerImages[];
	featuredProducts: ListItem[];
}

export interface BannerImages {
	imageUrl: string;
	searchUrl: string;
	originalUrl: string;
	originalSearch: { [key: string]: string };
	index: number;
}

interface BannerAds {
	id: number;
	contentName: string;
	contentType: string;
	adContentValueDtos: AdContentValueDto[];
	count: number;
}

interface DealerFeatured {
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
	sku: null | string;
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
