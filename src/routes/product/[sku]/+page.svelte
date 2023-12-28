<script lang="ts">
	import { onMount } from 'svelte';
	import type { PageData } from './$types';
	import ProductImages from './ProductImages.svelte';
	import { saveSession } from '$lib/session/saveSession';
	import type { ProductRes } from './ProductRes.server';
	import AddToCart from '$lib/itemList/AddToCart.svelte';

	export let data: PageData;
	saveSession(data);
	let images: { src: string; alt: string }[] | null = null,
		res: ProductRes | null;
	onMount(async () => {
		res = await data.product;
		images = res.items[0].mediaDtos
			.filter((v) => v.type === 'DefaultImage' || v.type === 'AdditionalImages')
			.map((v, i) => ({
				src: v.path,
				alt: `Image #${1} for ${res?.partNumber}`
			}));
	});
</script>

<svelte:head>
	<title>{res ? res?.items[0].name : 'Product Details'}</title>
</svelte:head>

<div class="flex flex-col justify-center md:flex-row p-1 pt-2">
	<div class="w-full md:max-w-xl flex justify-center">
		<div class="w-full max-w-xl">
			<ProductImages {images} />
		</div>
	</div>
	<div class="p-1 px-4 md:max-w-2xl w-full">
		<h1 class="h1 {!res ? 'variant-glass-tertiary rounded-md animate-pulse text-transparent' : ''}">
			{res?.items[0].name ?? '-'}
		</h1>
		<h2 class="py-2 h2 font-semibold flex align-middle">
			<span class={!res ? 'variant-glass-tertiary rounded-md animate-pulse text-transparent' : ''}>
				${res?.items[0].itemPrice ?? '--.--'}
			</span>
			<span class="flex-grow" />
			<span class="chip m-1">
				{res?.items[0].uom ?? '-'}
			</span>
			{#if res?.onSale}
				<span class="chip variant-soft-error m-1">Sale</span>
			{/if}
			<span class="chip text-md variant-soft-tertiary m-1">
				{data.sku}
			</span>
			<span
				class="chip m-1 {!res
					? 'variant-filled-tertiary w-[68px]'
					: res?.items[0].outOfStock
					? 'variant-filled-warning'
					: 'variant-filled-secondary'}"
			>
				{!res ? '-' : res?.items[0].outOfStock ? 'Backorder' : 'In Stock'}
			</span>
		</h2>
		<AddToCart sku={data.sku} large />
		<div
			class="mt-4 {!res ? 'variant-glass-tertiary rounded-md animate-pulse text-transparent' : ''}"
		>
			{@html res?.items[0].longDescription ?? '<br/><br/><br/>'}
		</div>
		<div class="pt-4">{@html res?.items[0].displayAttributes ?? ''}</div>
	</div>
</div>
