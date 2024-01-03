<script lang="ts">
	import ListItem from '$lib/itemList/ListItem.svelte';
	import IntersectionObserver from 'svelte-intersection-observer';
	import type { searchStore } from './searchStore';

	export let grid = true,
		page: number,
		pages: ReturnType<typeof searchStore>,
		totalItemsLeft: null | number = null;

	$: pageItems = $pages[page].items;

	let el: HTMLDivElement,
		onScreen: boolean,
		nextPage = false;

	$: {
		if (!nextPage && totalItemsLeft && totalItemsLeft > 12 && (page === 0 || onScreen)) {
			nextPage = true;
			if (!$pages[page + 1]) pages.getPage(page + 1);
		}
	}
</script>

{#if pageItems[0]}
	<IntersectionObserver element={el} bind:intersecting={onScreen} threshold={0.5}>
		<div bind:this={el} class="p-0.5">
			<ListItem item={pageItems[0]} {grid} />
		</div>
	</IntersectionObserver>
{/if}

{#each pageItems.slice(1) ?? [] as item}
	<div class="p-0.5">
		<ListItem {item} {grid} />
	</div>
{/each}

{#each new Array((pageItems && pageItems.length > 0) || totalItemsLeft === 0 ? 0 : totalItemsLeft === null ? 12 : totalItemsLeft > 12 ? 12 : totalItemsLeft) as _}
	<div class="p-0.5">
		<div
			class="card w-full h-full {grid
				? 'min-h-[390px]'
				: 'min-h-[157px] sm:min-h-[90px]'} animate-pulse"
		/>
	</div>
{/each}
