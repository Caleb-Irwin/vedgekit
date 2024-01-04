import { writable } from 'svelte/store';
import type { Cart } from './getCart';
import { getContext, setContext } from 'svelte';

const key = 'cartStore';

function createCartStore() {
	const { set, subscribe } = writable<Cart | undefined>(undefined);

	return {
		subscribe,
		updateCart: (cart: Cart) => set(cart)
	};
}

export function initCartStore() {
	const cart = createCartStore();
	setContext(key, cart);
	return cart;
}

export function getCartStore() {
	return getContext<ReturnType<typeof createCartStore>>(key);
}
