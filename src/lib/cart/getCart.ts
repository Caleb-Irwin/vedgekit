import type { SessionManager } from '$lib/session/server';
import { getCartId } from './getCartId';

export interface Cart {
	id: number | null;
	status: 'VOID' | 'ACTIVE' | string;
	cartNote: string;
	cartName: string;
	cartSubtotalCents: number;
	cartTotalCents: number;
	items: CartItem[];
	discount: string | null; // Unknown
	coupon: Coupon | null;
}

export interface CartItem {
	sku: string;
	quantity: number;
	uom: string;
	comment: string;
	cartItemId: number;
	name: string;
	description: string | null;
	image: string;
	itemPriceCents: number;
	totalPriceCents: number;
	discount: null | number;
	inventory: number;
	outOfStock: boolean;
}

interface Coupon {
	// Wholly Unknown
	valid: boolean;
	description: string | null;
	code: string | null;
	discount: string | null;
}
export async function getCart(
	session: InstanceType<typeof SessionManager>,
	internalFetch: typeof fetch
): Promise<Cart> {
	await session.ready;
	if (session.s.vCartId === null)
		try {
			await getCartId(session, internalFetch);
		} catch (e) {
			return emptyCart();
		}

	const res = await session.req('/cartListDetails', {}, {}, fetch);

	if (res.status !== 200) return emptyCart();

	let raw: RawObject;
	try {
		raw = await res.json();
	} catch (e) {
		return emptyCart();
	}

	const items = raw.cartItems.map(
		(item): CartItem => ({
			sku: item.sku,
			quantity: item.quantity,
			uom: item.uom,
			comment: item.comment,
			cartItemId: item.cartItemId,
			name: item.name,
			description: (item.description as string) ?? null,
			image: item.image,
			itemPriceCents: item.itemPrice * 100,
			totalPriceCents: item.totalPrice * 100,
			discount: typeof item.discount === 'number' ? (item.discount as number) : null,
			inventory: item.inventory,
			outOfStock: item.outOfStock
		})
	);

	const coupon: Coupon = {
		valid: raw.validCoupon,
		description: raw.couponDescription as string | null,
		code: raw.couponCode as string | null,
		discount: raw.couponDiscount as string | null
	};

	const cart: Cart = {
		id: raw.cartId,
		status: raw.status,
		cartNote: raw.cartComment,
		cartName: raw.cartName,
		cartSubtotalCents: raw.cartValue * 100,
		cartTotalCents: raw.cartTotal * 100,
		items: items,
		discount: typeof raw.discount === 'string' ? (raw.discount as string) : null,
		coupon: coupon
	};

	return cart;
}

const emptyCart = (): Cart => ({
	id: null,
	status: 'VOID',
	cartNote: '',
	cartName: '',
	cartSubtotalCents: 0,
	cartTotalCents: 0,
	items: [],
	discount: null,
	coupon: null
});

interface RawObject {
	cartId: number;
	userId: number;
	deptId: number;
	cartComment: string;
	cartName: string;
	cartValue: number;
	cartTotal: number;
	status: string;
	timePlaced: string;
	timeUpdated: string;
	shippingAddressId: number;
	billingAddressid: number;
	orderSubmitterName: string;
	shipmentScheduleMap: RawShipmentScheduleMap;
	taxList: unknown[];
	paymentMethods: RawPaymentMethod[];
	shippingMethod?: unknown;
	yourCode: boolean;
	couponDescription?: unknown;
	couponCode?: unknown;
	discount?: unknown;
	couponDiscount?: unknown;
	cartItems: RawCartItem[];
	itemsCount: number;
	cardSupportInfoDtos: unknown[];
	hashMap: object;
	chargesDtos: object;
	validCoupon: boolean;
	stripeEnabled: boolean;
}

interface RawCartItem {
	cartItemId: number;
	itemPrice: number;
	totalPrice: number;
	quantity: number;
	comment: string;
	sku: string;
	name: string;
	image: string;
	definingAttributeName?: unknown;
	definingAttributeValue?: unknown;
	inventory: number;
	customerId: number;
	outOfStock: boolean;
	customcode: string;
	field4?: unknown;
	dynamicField?: unknown;
	dynamicFieldValue?: unknown;
	field3?: unknown;
	description?: unknown;
	couponCode?: unknown;
	discount?: unknown;
	showQuoteButton: boolean;
	supplementaryCharge: boolean;
	couponInfo: boolean;
	chargesDto: RawChargesDto;
	uom: string;
}

interface RawChargesDto {
	id: number;
	cartItemId: number;
	chargeName?: unknown;
	chargeCode?: unknown;
	chargeMessage?: unknown;
	cartMessage?: unknown;
	itemNumber?: unknown;
	optional: number;
	price?: unknown;
}

interface RawPaymentMethod {
	id: number;
	createddate?: unknown;
	description: string;
	filed1?: unknown;
	filed2?: unknown;
	filed3?: unknown;
	langId: number;
	name: string;
	updateddate?: unknown;
}

interface RawShipmentScheduleMap {
	orderWasPlaced: string;
}
