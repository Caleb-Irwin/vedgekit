export const prerender = true;

import type { RequestHandler } from './$types';
import { SessionManager } from '$lib/session/server';
import type { ListItem } from '$lib/itemList/listItem';

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
	const productSkus = ((await pRes.json()) as DealerFeatured).adContentValueDtos
		.map(({ sku }) => encodeURIComponent(sku as string))
		.join(',');

	const sRes = (await (
		await session.req(
			'/items?disableFuzzySearch=true&rows=15',
			{},
			{
				customQuery: {
					skus: productSkus
				}
			}
		)
	).json()) as Items[];

	const featuredProducts = sRes.map(
		(item, i): ListItem => ({
			productUrl: `/product/${encodeURIComponent(item.partNumber)}`,
			imageUrl: `/api/home/${i}.png`,
			productNumber: item.partNumber,
			name: item.name,
			price: item.itemPrice,
			uom: item.uom,
			inStock: !item.outOfStock,
			saleItem: false,
			raw: { originalUrl: item.detailImage }
		})
	);

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

interface Items {
	name: string;
	etilizeId: string;
	partNumber: string;
	detailImage: string;
	enlargeImage: string;
	shortDescription: string;
	longDescription: string;
	productSpecifications: string;
	packagedQuantity: string;
	imageURL: string;
	imageSpecs: string;
	productPartNumber: string;
	trimmedProductSpecification: string;
	manufacturerPartNumber: string;
	definingAttributeName?: null;
	definingAttributeValue?: null;
	itemPrice: string;
	etilizeData: boolean;
	outOfStock: boolean;
	hasPriceRange: boolean;
	uom: string;
	customCode: string;
	inventory: number;
	showPoweredByGFK: boolean;
	showCartButton: boolean;
	showQuoteButton: boolean;
	priceRanges: unknown[];
	mediaDtos: unknown[];
	regularPriceExist: boolean;
	outOfStockMessage?: unknown;
	onClearance: boolean;
	supplementaryCharges?: unknown;
	xrefno: string;
	displayAttributes: string;
	meta: unknown;
	regularPrice?: unknown;
	yourPrice?: unknown;
	showSupplementaryCharges: boolean;
}
