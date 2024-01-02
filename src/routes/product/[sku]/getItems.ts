import type { ListItem } from '$lib/itemList/listItem';
import type { SessionManager } from '$lib/session/server';

export async function getItems(
	session: SessionManager,
	skus: string[],
	customFetch: typeof fetch = fetch,
	featuredItemsMode = false
): Promise<ListItem[]> {
	const res = await (
		await session.req(
			'/items?disableFuzzySearch=true&rows=15',
			{},
			{
				customQuery: {
					skus: skus.join(',')
				}
			},
			customFetch
		)
	).json<Items[]>();

	return res.map(
		(item, i): ListItem => ({
			productUrl: `/product/${encodeURIComponent(item.partNumber)}`,
			imageUrl: featuredItemsMode ? `/api/home/${i}.png` : item.detailImage,
			productNumber: item.partNumber,
			name: item.name,
			price: item.itemPrice,
			uom: item.uom,
			inStock: !item.outOfStock,
			saleItem: false,
			raw: featuredItemsMode ? { originalUrl: item.detailImage } : undefined
		})
	);
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
