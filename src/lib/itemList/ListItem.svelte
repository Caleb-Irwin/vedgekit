<script lang="ts">
	import type { ListItem } from './listItem';
	import AddToCart from './AddToCart.svelte';
	import { preloadData } from '$app/navigation';

	export let item: ListItem,
		grid = true;
</script>

<div
	on:mouseover|once={() => {
		preloadData(item.productUrl);
	}}
	on:focus|once={() => {
		preloadData(item.productUrl);
	}}
	role="region"
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
			{#if item.saleItem}
				<span class="chip variant-soft-error">Sale</span>
			{/if}
			<span class="chip variant-soft-tertiary">
				{item.productNumber}
			</span>
			<span class="chip {!item.inStock ? 'variant-filled-warning' : 'variant-filled-secondary'}">
				{!item.inStock ? 'Backorder' : 'In Stock'}
			</span>
		</p>
	</div>

	<div class="w-full h-2 lg:hidden" />

	<div class={grid ? 'mt-0.5' : ''}>
		<AddToCart sku={item.productNumber} />
	</div>
</div>
