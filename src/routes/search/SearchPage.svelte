<script lang="ts">
	import ListItem from '$lib/itemList/ListItem.svelte';
	import type { ListItem as ListItemT } from '$lib/itemList/listItem';
	import { onMount } from 'svelte';
	import IntersectionObserver from 'svelte-intersection-observer';
	import type { SearchRes } from './SearchRes.server';
	import type { simpleSearch } from './SimpleSearch.server';

	export let grid = true,
		totalItemsLeft: null | number = null,
		page: number = 0,
		serverItems: Promise<SearchRes> | null = null,
		params: string = '';
	let items: ListItemT[] = [],
		el: HTMLDivElement,
		onScreen: boolean,
		nextPage = false,
		loading = true;
	$: {
		if (totalItemsLeft && serverItems) loading = false;
	}
	$: {
		if (!nextPage && totalItemsLeft && totalItemsLeft > 12 && (page === 0 || onScreen)) {
			nextPage = true;
		}
	}
	onMount(async () => {
		let res: SearchRes;
		if (serverItems) {
			res = await serverItems;
			totalItemsLeft = res.searchResults.productCount;
		} else {
			const fetchRes = await fetch(`/search/page?page=${page}&${params}`);
			if (fetchRes.status !== 200) {
				alert('Failed to get more search results!');
				return;
			}
			res = ((await fetchRes.json()) as Awaited<ReturnType<typeof simpleSearch>>).search;
		}
		items = res.searchResults.solrProducts.map((item) => ({
			productUrl: `/product/${encodeURIComponent(item.partnumber)}`,
			imageUrl: item.basicsItems[0].listViewImgURL,
			productNumber: item.partnumber,
			name: item.name,
			price: item.basicsItems[0].price,
			uom: item.basicsItems[0].selling_UOM,
			inStock: !item.basicsItems[0].outOfStock,
			raw: item
		}));
		loading = false;
	});
</script>

{#if items[0]}
	<IntersectionObserver element={el} bind:intersecting={onScreen} threshold={0.5}>
		<div bind:this={el} class="p-0.5">
			<ListItem item={items[0]} {grid} />
		</div>
	</IntersectionObserver>
{/if}

{#each items.slice(1) as item}
	<div class="p-0.5">
		<ListItem {item} {grid} />
	</div>
{/each}

{#each new Array(!loading ? 0 : totalItemsLeft === null ? 12 : totalItemsLeft > 12 ? 12 : totalItemsLeft) as _}
	<div class="p-0.5">
		<div
			class="card w-full h-full {grid
				? 'min-h-[390px]'
				: 'min-h-[157px] sm:min-h-[90px]'} animate-pulse"
		/>
	</div>
{/each}

{#if nextPage && totalItemsLeft}
	<svelte:self {grid} page={page + 1} totalItemsLeft={totalItemsLeft - 12} {params} />
{/if}
