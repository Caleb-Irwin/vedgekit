<script lang="ts">
	import { enhance } from '$app/forms';
	import Fa from 'svelte-fa';
	import type { ListItem } from './listItem';
	import { faCartShopping } from '@fortawesome/free-solid-svg-icons';
	import { faCheck } from '@fortawesome/free-solid-svg-icons/index';

	export let item: ListItem,
		grid = true;
	let qty = 1,
		updatingQuantity = false,
		success = false;
</script>

<div
	class="card max-w-none w-full h-full p-2 flex justify-center items-center {grid
		? 'flex-col'
		: 'flex-row flex-wrap'}"
>
	{#if item.imageUrl}
		<a
			class="{grid ? 'w-full' : 'h-20 w-20'} aspect-square p-1 card hover:cursor-pointer"
			href={item.productUrl}
		>
			<img
				src={item.imageUrl}
				alt="Image for {item.productNumber}"
				class="w-full rounded-sm"
				loading="lazy"
			/>
		</a>
	{/if}

	<div class="{grid ? 'px-1' : 'px-2'} flex-grow-[10] w-full basis-12">
		<a href={item.productUrl} class="font-semibold hover:underline">{item.name}</a>
		<p class="my-1">
			<span class="text-lg">
				${item.price}
			</span>
			<span class="chip">
				{item.uom}
			</span>
			<span class="chip variant-soft-tertiary">
				{item.productNumber}
			</span>
			<span
				class="chip h-6 {!item.inStock ? 'variant-filled-warning' : 'variant-filled-secondary'}"
			>
				{!item.inStock ? 'Backorder' : 'In Stock'}
			</span>
		</p>
	</div>

	<div class="w-full h-2 lg:hidden" />

	<form
		use:enhance={() => {
			updatingQuantity = true;
			success = false;
			return async ({ update }) => {
				success = true;
				await update({ reset: false, invalidateAll: false });
				qty = 1;
				updatingQuantity = false;
			};
		}}
		method="post"
		action="/cart?/add"
		class="{grid ? 'mt-1' : ''} flex flex-row justify-center flex-wrap space-y-1"
	>
		<div
			class="mx-2 btn-group {success
				? 'variant-outline-primary'
				: qty && qty >= 1
				? 'variant-outline-tertiary'
				: 'variant-outline-error'}"
		>
			<input type="hidden" name="sku" value={item.productNumber} />
			<input type="hidden" name="quantity" value={qty} />
			<button
				class="border-r-0 w-10 font-semibold"
				disabled={qty <= 1 || updatingQuantity}
				on:click|preventDefault={() => {
					success = false;
					qty--;
				}}>-</button
			>
			<input
				class="quantity-input w-12 p-0 bg-transparent border-x-0 border-y-[1px] {success
					? 'border-primary-500'
					: qty && qty >= 1
					? 'border-tertiary-500'
					: 'border-error-500'}  text-center remove-arrow"
				type="number"
				size="4"
				bind:value={qty}
				on:change={() => (success = false)}
				disabled={updatingQuantity}
			/>
			<button
				class="border-l-0 w-10 font-semibold"
				on:click|preventDefault={() => {
					success = false;
					qty++;
				}}
				disabled={updatingQuantity}>+</button
			>
		</div>
		<button
			class="btn btn-icon {success ? 'variant-filled-primary' : 'variant-filled-secondary'}"
			disabled={updatingQuantity}
		>
			{#if success}
				<Fa icon={faCheck} />
			{:else}
				<Fa icon={faCartShopping} />
			{/if}
		</button>
	</form>
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
