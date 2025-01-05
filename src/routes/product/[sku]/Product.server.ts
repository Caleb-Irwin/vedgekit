import type { ListItem } from '$lib/itemList/listItem';
import type { SessionManager } from '$lib/session/server';
import type { ProductRes } from './ProductRes.server';
import { relatedProducts } from './relatedProducts.server';

export interface Product {
	sku: string;
	name: string;
	price: string;
	uom: string;
	images: { src: string; alt: string }[];
	inStock: boolean;
	onSale: boolean;
	longDescHtml: string;
	displayAttributesHtml: string;
	relatedProducts: Promise<ListItem[]>;
}

export async function getProduct(
	sku: string,
	session: SessionManager,
	customFetch?: typeof fetch
): Promise<Product> {
	const res = await session.req(
		'/productDetailInfo',
		{},
		{
			customQuery: {
				sku
			}
		},
		customFetch
	);
	const raw = (await res.json()) as ProductRes;
	const {
		name,
		itemPrice: price,
		uom,
		mediaDtos,
		outOfStock,
		longDescription: longDescHtml,
		displayAttributes: displayAttributesHtml
	} = raw.items[0];

	return {
		sku,
		name,
		price,
		uom,
		images: mediaDtos
			.filter((v) => v.type === 'DefaultImage' || v.type === 'AdditionalImages')
			.map((v, i) => ({
				src: v.path,
				alt: `Image #${i} for ${sku}`
			})),
		inStock: !outOfStock,
		onSale: raw.onSale,
		longDescHtml,
		displayAttributesHtml,
		relatedProducts: relatedProducts(
			session,
			raw.recommendedCategory[0],
			raw.recommendedCategory[1],
			customFetch
		)
	};
}
