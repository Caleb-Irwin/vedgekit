<script lang="ts">
	import { faSearch } from '@fortawesome/free-solid-svg-icons/index';
	import Fa from 'svelte-fa';
	import type { PageData } from './$types';
	import Carousel from '$lib/home/FeaturedCarousel.svelte';
	import ListItem from '$lib/itemList/ListItem.svelte';

	export let data: PageData;
</script>

<svelte:head>
	<title>Vedgekit Home</title>
</svelte:head>

<div class="h-full w-full flex justify-center items-start">
	<div class="w-full space-y-10 text-center flex flex-col items-center p-2">
		{#if data.featured}
			<div class="w-full aspect-[1805/351]">
				<Carousel bannerImages={data.featured.bannerImages} />
			</div>
		{/if}
		<h1 class="h1">Vedgekit.</h1>
		<form
			action="/search"
			method="get"
			class="input-group input-group-divider grid-cols-[1fr_auto] max-w-2xl"
		>
			<input
				type="text"
				name="query"
				id=""
				placeholder="Search Products"
				class="input p-4 text-lg"
			/>
			<button class="variant-filled-primary text-lg"><Fa icon={faSearch} /></button>
		</form>

		<div>
			<h3 class="text-3xl p-1">Featured Products</h3>
			<div class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6">
				{#each data.featured.featuredProducts as item}
					<div class="p-0.5">
						<ListItem {item} />
					</div>
				{/each}
			</div>
		</div>
	</div>
</div>
