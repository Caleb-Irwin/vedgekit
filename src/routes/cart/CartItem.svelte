<script lang="ts">
	import type { Cart, CartItem } from '$lib/cart/getCart';
	import Fa from 'svelte-fa';
	import { faTrash, faPen } from '@fortawesome/free-solid-svg-icons';
	import { debounce } from 'lodash';

	export let item: CartItem,
		cartPromise: Promise<Cart> | undefined = undefined;

	import { format } from '$lib/formatPrice';
	import { enhance } from '$app/forms';
	import { slide } from 'svelte/transition';

	let quantity = item.quantity,
		updatingQuantity = false,
		formEl: HTMLFormElement,
		writeNote = !!item.comment,
		inQuantity = item.quantity;

	$: {
		if (inQuantity !== item.quantity) {
			inQuantity = item.quantity;
			quantity = item.quantity;
		}
	}

	const updateQuantity = debounce(() => {
		if (quantity !== null && quantity >= 1) {
			formEl.requestSubmit();
		}
	}, 1000);

	$: {
		if (quantity !== item.quantity && !updatingQuantity) {
			updateQuantity();
		}
	}
</script>

<div class="card p-2 w-full flex flex-row justify-center items-center flex-wrap" transition:slide>
	{#if item.image}
		<a
			class="h-20 w-20 aspect-square p-1 card hover:cursor-pointer"
			href={'/product/' + encodeURIComponent(item.sku)}
		>
			<img src={item.image} alt="Image for {item.sku}" />
		</a>
	{/if}

	<div class="px-2 flex-grow-[10] basis-12">
		<a href={'/product/' + encodeURIComponent(item.sku)} class=" font-semibold hover:underline"
			>{item.name}</a
		>
		<p class=" my-1">
			${item.itemPriceCents / 100}
			<span class="chip">
				{item.uom}
			</span>
			<span class="chip variant-soft-tertiary">
				{item.sku}
			</span>
			<span class="chip {item.outOfStock ? 'variant-filled-warning' : 'variant-filled-secondary'}">
				{item.outOfStock ? 'Backorder' : item.inventory + ' Available'}
			</span>
		</p>
	</div>

	<div class="w-full h-2 lg:hidden" />

	<button
		class="btn-icon btn-icon-sm {writeNote ? 'variant-outline-tertiary' : ''}"
		disabled={updatingQuantity}
		on:click={() => (writeNote = !writeNote)}
	>
		<Fa icon={faPen} />
	</button>
	<form
		use:enhance={() => {
			updatingQuantity = true;

			return async ({ update }) => {
				await update({ reset: false });
				await cartPromise;
				updatingQuantity = false;
			};
		}}
		method="post"
		action="/cart?/add"
		class="mx-2 btn-group variant-glass {quantity && quantity >= 1
			? 'variant-outline-tertiary'
			: 'variant-outline-error'}"
		bind:this={formEl}
	>
		<input type="hidden" name="sku" value={item.sku} />
		<input type="hidden" name="quantity" value={quantity - item.quantity} />
		<button
			class="border-r-0 w-10 font-semibold"
			disabled={quantity <= 1 || updatingQuantity}
			on:click|preventDefault={() => quantity--}>-</button
		>
		<input
			class="quantity-input w-12 p-0 bg-transparent border-x-0 border-y-[1px] {quantity &&
			quantity >= 1
				? 'border-tertiary-500'
				: 'border-error-500'}  text-center remove-arrow"
			type="number"
			size="4"
			bind:value={quantity}
			disabled={updatingQuantity}
		/>
		<button
			class="border-l-0 w-10 font-semibold"
			on:click|preventDefault={() => quantity++}
			disabled={updatingQuantity}>+</button
		>
	</form>
	<form
		class="p-0 m-0"
		action="/cart?/remove"
		method="post"
		use:enhance={() => {
			updatingQuantity = true;
			return async ({ update }) => {
				await update({ reset: false });
				await cartPromise;
				setTimeout(() => {
					updatingQuantity = false;
				}, 1000);
			};
		}}
	>
		<input type="hidden" name="cartItemId" value={item.cartItemId} />
		<button class="btn-icon btn-icon-sm" disabled={updatingQuantity}>
			<Fa icon={faTrash} />
		</button>
	</form>

	<div class="flex-grow lg:flex-grow-0" />

	<div class="grid place-content-center flex-grow-[10] max-w-[96px]">
		<p class="text-lg mr-1">
			{#if item.quantity === quantity && !updatingQuantity}
				{format(item.totalPriceCents / 100)}
			{:else}
				<div class="h-7 w-20 placeholder {updatingQuantity ? 'animate-pulse' : ''}" />
			{/if}
		</p>
	</div>
	{#if writeNote}
		<div class="pt-2 w-full">
			<div class="w-full flex justify-end z-20">
				<span
					class="absolute m-1 chip
				variant-ghost-primary">Saved</span
				>
			</div>
			<textarea class="textarea m-0 z-10" placeholder="Shopper's Notes" />
		</div>
	{/if}
</div>

<style lang="postcss">
	.remove-arrow::-webkit-inner-spin-button,
	.remove-arrow::-webkit-outer-spin-button {
		-webkit-appearance: none;
		margin: 0;
	}
	.remove-arrow {
		-moz-appearance: textfield;
	}
</style>
