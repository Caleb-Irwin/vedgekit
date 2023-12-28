<script lang="ts">
	import { onMount } from 'svelte';
	import type { PageData } from './$types';
	import ProductImages from './ProductImages.svelte';
	import { saveSession } from '$lib/session/saveSession';
	import AddToCart from '$lib/itemList/AddToCart.svelte';

	export let data: PageData;
	saveSession(data);
	let product: Awaited<typeof data.product> | null;
	onMount(async () => {
		product = await data.product;
	});
</script>

<svelte:head>
	<title>{product ? product.name : 'Product Details'}</title>
</svelte:head>

<div class="flex flex-col justify-center md:flex-row p-1 pt-2">
	<div class="w-full md:max-w-xl flex justify-center">
		<div class="w-full max-w-xl">
			<ProductImages images={product?.images ?? null} />
		</div>
	</div>
	<div class="p-1 px-4 md:max-w-2xl w-full">
		<h1
			class="h1 {!product
				? 'variant-glass-tertiary rounded-md animate-pulse text-transparent'
				: ''}"
		>
			{product?.name ?? '-'}
		</h1>
		<h2 class="py-2 h2 font-semibold flex align-middle">
			<span
				class={!product ? 'variant-glass-tertiary rounded-md animate-pulse text-transparent' : ''}
			>
				${product?.price ?? '--.--'}
			</span>
			<span class="flex-grow" />
			<span class="chip m-1">
				{product?.uom ?? '-'}
			</span>
			{#if product?.onSale}
				<span class="chip variant-soft-error m-1">Sale</span>
			{/if}
			<span class="chip text-md variant-soft-tertiary m-1">
				{data.sku}
			</span>
			<span
				class="chip m-1 {!product
					? 'variant-filled-tertiary w-[68px]'
					: product?.inStock
					? 'variant-filled-secondary'
					: 'variant-filled-warning'}"
			>
				{!product ? '-' : !product?.inStock ? 'Backorder' : 'In Stock'}
			</span>
		</h2>
		<AddToCart sku={data.sku} large />
		<div
			class="mt-4 {!product
				? 'variant-glass-tertiary rounded-md animate-pulse text-transparent'
				: ''}"
		>
			{@html product?.longDescHtml ?? '<br/><br/><br/>'}
		</div>
		<div class="pt-4">{@html product?.displayAttributesHtml ?? ''}</div>
	</div>
</div>
