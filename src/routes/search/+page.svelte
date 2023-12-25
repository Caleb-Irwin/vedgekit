<script lang="ts">
	import ListItem from '$lib/itemList/ListItem.svelte';
	import Fa from 'svelte-fa';
	import type { PageData } from './$types';
	import { faBars, faGrip } from '@fortawesome/free-solid-svg-icons/index';

	export let data: PageData;
	let grid = true;
</script>

<h1 class="p-4 pb-2 text-3xl flex">
	{data.featuredMode
		? `Featured Product Collection ${parseInt(data.searchTerm ?? '0') + 1}`
		: `Search results for "${data.searchTerm}"`}
	<span class="flex-grow" />
	<button
		class="btn btn-icon {grid ? 'variant-filled-tertiary' : ''}"
		on:click={() => (grid = true)}><Fa icon={faGrip} /></button
	>
	<button
		class="btn btn-icon {grid ? '' : 'variant-filled-tertiary'}"
		on:click={() => (grid = false)}><Fa icon={faBars} /></button
	>
</h1>

<div
	class="grid m-0.5 md:mx-2 {grid
		? 'grid-cols-2 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-6 '
		: 'grid-cols-1'}"
>
	{#await data.search.s}
		{#each new Array(12) as _}
			<div class="p-0.5">
				<div
					class="card w-full h-full {grid
						? 'min-h-[390px]'
						: 'min-h-[157px] sm:min-h-[90px]'} animate-pulse"
				/>
			</div>
		{/each}
	{:then res}
		{#each res.searchResults.solrProducts as item}
			<div class="p-0.5">
				<ListItem
					item={{
						productUrl: `/product/${encodeURIComponent(item.partnumber)}`,
						imageUrl: item.basicsItems[0].listViewImgURL,
						productNumber: item.partnumber,
						name: item.name,
						price: item.basicsItems[0].price,
						uom: item.basicsItems[0].selling_UOM,
						inStock: !item.basicsItems[0].outOfStock,
						raw: item
					}}
					{grid}
				/>
			</div>
		{/each}
	{/await}
</div>
