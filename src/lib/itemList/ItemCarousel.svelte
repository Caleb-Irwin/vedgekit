<script lang="ts">
	import ListItem from './ListItem.svelte';
	import type { ListItem as ListItemT } from './listItem';

	export let items: ListItemT[] | null,
		title: string | undefined = undefined,
		carosuel = false;
</script>

<div class="w-full">
	{#if title}
		<h3 class="text-2xl p-1 text-center">{title}</h3>
	{/if}
	<div
		class="w-full h-full {!carosuel
			? 'grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-6'
			: 'snap-x snap-mandatory scroll-smooth flex overflow-x-auto shadow-inherit'} "
	>
		{#if carosuel}
			<div class="flex-grow snap-start flex-shrink-0 w-1.5" />
		{/if}
		{#each items ?? Array(6) as item}
			<div class="{carosuel ? 'snap-start flex-shrink-0 w-48 md:w-60' : ''} p-0.5">
				{#if item}
					<ListItem {item} />
				{:else}
					<div class="card h-96" />
				{/if}
			</div>
		{/each}
		{#if carosuel}
			<div class="flex-grow snap-start flex-shrink-0 w-1.5" />
		{/if}
	</div>
</div>
