<script lang="ts">
	import type { PageData } from './$types';
	import CartItem from './CartItem.svelte';
	import { format } from '$lib/formatPrice';
	import type { Cart } from '$lib/cart/getCart';
	import { slide } from 'svelte/transition';
	import { faArrowRight, faTag } from '@fortawesome/free-solid-svg-icons/index';
	import Fa from 'svelte-fa';
	import { goto } from '$app/navigation';
	import { saveSession } from '$lib/session/saveSession';

	export let data: PageData;
	saveSession(data);

	let cart: Cart | null = null,
		loadCart: Cart | undefined,
		lastLoadCart: Cart | undefined;

	$: cart = loadCart ?? lastLoadCart ?? null;

	const updateCart = async () => {
		loadCart = (await data.cart) ?? loadCart;
	};

	$: {
		data.cart;
		updateCart();
	}
</script>

<svelte:head>
	<title>Cart</title>
</svelte:head>

<h1 class="p-4 pb-2 text-3xl">Cart</h1>

<div class="p-2 lg:space-x-2 space-y-2 lg:space-y-0 flex flex-col lg:flex-row items-start">
	<div class="flex-grow w-full space-y-2">
		{#if cart}
			{#each cart.items as item (item.sku)}
				<CartItem {item} cartPromise={data.cart} />
			{:else}
				<div class="card p-10 w-full grid place-content-center text-center" transition:slide>
					<h2 class="text-2xl pb-2">Your cart is empty</h2>
					<a href="/" class="underline text-lg">Keep Shopping</a>
				</div>
			{/each}
		{:else}
			<div class="card animate-pulse h-24 w-full" />
		{/if}
	</div>
	<div class="lg:sticky lg:top-2 space-y-2 w-full lg:max-w-sm">
		<div class="card p-4">
			<h2 class="text-xl pb-2 font-semibold">
				{#if cart}
					{cart.id === null ? 'No Cart' : 'Cart #' + cart.id}
				{:else}
					<div class="h-7 w-24 placeholder animate-pulse" />
				{/if}
			</h2>

			<label class="label px-2" for="orderNotes">
				<span class="hidden">Order Notes</span>
				<textarea class="textarea" name="orderNotes" placeholder="Notes To Order Desk (TODO)" />
			</label>
			<div class="p-2">
				<div class="input-group input-group-divider grid-cols-[auto_1fr_auto]">
					<div class="input-group-shim"><Fa icon={faTag} /></div>
					<input type="search" placeholder="Coupon Code (TODO)" />
					<button class="variant-filled-tertiary text-center"><Fa icon={faArrowRight} /></button>
				</div>
			</div>
			<div class="flex text-lg">
				<span class="">Subtotal</span>
				<div class="text-right flex-grow">
					<span>{cart ? format(cart.cartSubtotalCents / 100) : '-'}</span>
				</div>
			</div>
			<div class="flex text-lg font-bold">
				<span class="">Total</span>
				<div class="text-right flex-grow">
					<span>{cart ? format(cart.cartTotalCents / 100) : '-'}</span>
				</div>
			</div>

			<button
				class="btn variant-filled-primary w-full my-2"
				on:click={() => goto('/cart/checkout')}
				disabled={!cart || cart.items.length === 0}>Checkout</button
			>
		</div>

		<button
			class="btn variant-filled-tertiary w-full my-2"
			on:click={async () => {
				if (!confirm('Are you sure you want to clear your cart?')) return;
				await fetch('/api/session?mode=new', { method: 'POST' });
				location.reload();
			}}
			data-sveltekit-preload-data={false}>Clear Cart</button
		>
	</div>
</div>
