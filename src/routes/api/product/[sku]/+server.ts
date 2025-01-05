import type { RequestHandler } from './$types';
import { error, json } from '@sveltejs/kit';
import type { ProductRes } from '../../../product/[sku]/ProductRes.server';

export const GET: RequestHandler = async ({ locals: { session }, fetch, params: { sku } }) => {
	try {
		const res = await session.req(
			'/productDetailInfo',
			{},
			{
				customQuery: {
					sku
				}
			},
			fetch
		);

		if (res.status === 404) {
			return error(404, 'Failed to find product');
		}

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

		return json({
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
			displayAttributesHtml
		});
	} catch (e) {
		console.log(e);
		return error(500, 'Failed to get product');
	}
};
