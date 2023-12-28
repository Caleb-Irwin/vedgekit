import type { PageServerLoad } from './$types';
import { getProduct } from './product.server';

export const load: PageServerLoad = async ({ params: { sku }, fetch, locals: { session } }) => {
	const product = getProduct(sku, session, fetch);

	return {
		product,
		sku,
		...session.stream([product])
	};
};
