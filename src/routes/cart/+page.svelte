<script lang="ts">
	import { enhance } from '$app/forms';
	import { checkOutUrl } from '$lib/cart/checkOutUrl';
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

	let sku = '51-0812',
		quantity = 1,
		cart: Cart | null = null,
		loadCart: Cart | undefined,
		lastLoadCart: Cart | undefined,
		creating = false;

	$: cart = loadCart ?? lastLoadCart ?? null;

	const updateCart = async () => {
		loadCart = (await data.cart) ?? loadCart;
	};

	$: {
		data.cart;
		updateCart();
	}
</script>

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
				<textarea class="textarea" name="orderNotes" placeholder="Notes To Order Desk" />
			</label>
			<div class="p-2">
				<div class="input-group input-group-divider grid-cols-[auto_1fr_auto]">
					<div class="input-group-shim"><Fa icon={faTag} /></div>
					<input type="search" placeholder="Coupon Code" />
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
				on:click={() => goto(checkOutUrl())}
				data-sveltekit-preload-data="off"
				disabled={!cart || cart.items.length === 0}>Check Out</button
			>
		</div>
		<form
			method="POST"
			action="?/add"
			class="card p-4"
			use:enhance={() => {
				creating = true;
				return async ({ update }) => {
					await update();
					creating = false;
				};
			}}
		>
			<label for="sku" class="pb-1">Add SKU To Cart</label>
			<div class="flex">
				<div class="input-group input-group-divider grid-cols-[auto_1fr_auto]">
					<input name="sku" type="text" placeholder="SKU" bind:value={sku} disabled={creating} />
					<input
						name="quantity"
						class="input-group-shim"
						type="number"
						placeholder="1"
						bind:value={quantity}
						disabled={creating}
					/>
				</div>
				<button class="btn variant-filled-secondary ml-2" disabled={creating}>Add</button>
			</div>
		</form>
		<button
			class="btn variant-filled-tertiary w-full my-2"
			on:click={() => fetch('/api/session?mode=new', { method: 'POST' })}
			data-sveltekit-preload-data={false}>Clear Cart</button
		>
	</div>
</div>
