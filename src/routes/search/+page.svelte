<script lang="ts">
	import ListItem from '$lib/itemList/ListItem.svelte';
	import Fa from 'svelte-fa';
	import type { PageData } from './$types';
	import { faBars, faGrip } from '@fortawesome/free-solid-svg-icons/index';

	export let data: PageData;
	let grid = true;
</script>

<button class="btn btn-icon" on:click={() => (grid = true)}><Fa icon={faGrip} /></button>
<button class="btn btn-icon" on:click={() => (grid = false)}><Fa icon={faBars} /></button>

<div
	class="grid m-0.5 {grid
		? 'grid-cols-2 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-6 '
		: 'grid-cols-1'}"
>
	{#await data.search.s}
		Loading...
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
