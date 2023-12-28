<script lang="ts">
	import Fa from 'svelte-fa';
	import type { PageData } from './$types';
	import { faBars, faGrip } from '@fortawesome/free-solid-svg-icons/index';
	import { onMount } from 'svelte';
	import SearchPage from './SearchPage.svelte';
	import { saveSession } from '$lib/session/saveSession';

	export let data: PageData;
	saveSession(data);

	let grid = true,
		totalItems: null | number = null;

	onMount(async () => {
		const res = await data.search;
		totalItems = res.totalItems;
	});
</script>

<svelte:head>
	<title>{data.featuredMode ? 'Featured Products' : 'Search Results'}</title>
</svelte:head>

<h1 class="p-4 pb-2 text-3xl flex items-center">
	<span>
		{data.featuredMode ? `Featured Product Collection` : `Search Results For "${data.searchTerm}"`}
		{#if totalItems || totalItems === 0}
			<span class="text-tertiary-500">{totalItems} {data.featuredMode ? 'Items' : 'Results'}</span>
		{/if}
	</span>
	<span class="flex-grow" />
	<button
		class="btn btn-icon btn-icon-lg w-12 h-12 {grid ? 'variant-filled-tertiary' : ''}"
		on:click={() => (grid = true)}><Fa icon={faGrip} /></button
	>
	<button
		class="btn btn-icon btn-icon-lg w-12 h-12 {grid ? '' : 'variant-filled-tertiary'}"
		on:click={() => (grid = false)}><Fa icon={faBars} /></button
	>
</h1>

<div
	class="grid m-0.5 md:mx-2 {grid
		? 'grid-cols-2 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-6 '
		: 'grid-cols-1'}"
>
	<SearchPage {grid} page={data.page} params={data.params} serverItems={data.search} />
</div>
