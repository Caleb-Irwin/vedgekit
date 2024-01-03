<script lang="ts">
	import Fa from 'svelte-fa';
	import type { PageData } from './$types';
	import { faBars, faEdit, faGrip } from '@fortawesome/free-solid-svg-icons/index';
	import SearchPage from './SearchPage.svelte';
	import { saveSession } from '$lib/session/saveSession';
	import { openSearch } from '../Nav.svelte';
	import { searchStore } from './searchStore';
	import { browser } from '$app/environment';
	import type { Snapshot } from '../$types';
	import { tick } from 'svelte';

	export let data: PageData;
	saveSession(data);

	let grid = true,
		totalItems: null | number = null,
		pages = searchStore(data.params),
		restored: string | undefined;

	$: {
		data.search;
		load();
	}

	const load = async () => {
		if (browser && data.params !== restored) {
			totalItems = null;
			pages = searchStore(data.params);
			pages.addPage([], 0);
			const res = await data.search;
			totalItems = res.totalItems;
			pages.addPage(res.items, 0);
		}
	};

	export const snapshot: Snapshot<{
		pages: ReturnType<typeof searchStore>;
		totalItems: number | null;
		grid: boolean;
		params: string;
		scroll: number;
	}> = {
		capture: () => ({
			pages,
			totalItems,
			grid,
			params: data.params,
			scroll: document.querySelector('#page')?.scrollTop ?? 0
		}),
		restore: (v) => {
			if ((data.params = v.params)) {
				pages = v.pages;
				totalItems = v.totalItems;
				grid = v.grid;
				restored = data.params;
				tick().then(() => {
					const el = document.querySelector('#page');
					if (el) el.scrollTop = v.scroll;
				});
			}
		}
	};
</script>

<svelte:head>
	<title>{data.featuredMode ? 'Featured Products' : 'Search Results'}</title>
</svelte:head>

<h1 class="p-4 pb-2 text-3xl flex items-center">
	<span>
		{data.featuredMode ? `Featured Product Collection` : `Search Results For "${data.searchTerm}"`}
		{#if !data.featuredMode}
			<button
				on:click={() => {
					openSearch(data.searchTerm);
				}}
				class="hover:text-tertiary-500"><Fa size="0.75x" icon={faEdit} /></button
			>
		{/if}
		{#if totalItems || totalItems === 0}
			<span class="text-tertiary-500">{totalItems} {data.featuredMode ? 'Items' : 'Results'}</span>
		{/if}
	</span>
	<span class="flex-grow" />
	<div class="flex flex-col sm:flex-row rounded-full p-1 variant-outline-tertiary border-[1px]">
		<button
			class="btn btn-icon btn-icon-lg w-12 h-12 {grid ? 'variant-filled-tertiary' : ''}"
			on:click={() => (grid = true)}><Fa icon={faGrip} /></button
		>
		<button
			class="btn btn-icon btn-icon-lg w-12 h-12 {grid ? '' : 'variant-filled-tertiary'}"
			on:click={() => (grid = false)}><Fa icon={faBars} /></button
		>
	</div>
</h1>

<div
	class="grid m-0.5 md:mx-2 {grid
		? 'grid-cols-2 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-6 '
		: 'grid-cols-1'}"
>
	{#key data.search}
		{#each $pages as _, i}
			<SearchPage
				{grid}
				page={i}
				{pages}
				totalItemsLeft={totalItems !== null ? totalItems - 12 * i : null}
			/>
		{/each}
	{/key}
</div>
