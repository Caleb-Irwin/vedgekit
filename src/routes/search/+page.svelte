<script lang="ts">
	import Fa from 'svelte-fa';
	import type { PageData } from './$types';
	import { faBars, faEdit, faGrip } from '@fortawesome/free-solid-svg-icons/index';
	import { onMount } from 'svelte';
	import SearchPage from './SearchPage.svelte';
	import { saveSession } from '$lib/session/saveSession';
	import { openSearch } from '../Nav.svelte';

	export let data: PageData;
	saveSession(data);

	let grid = true,
		totalItems: null | number = null;

	$: {
		data.search;
		load();
	}

	onMount(() => {
		load();
	});

	const load = async () => {
		totalItems = null;
		const res = await data.search;
		totalItems = res.totalItems;
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
		<SearchPage {grid} page={data.page} params={data.params} serverItems={data.search} />
	{/key}
</div>
