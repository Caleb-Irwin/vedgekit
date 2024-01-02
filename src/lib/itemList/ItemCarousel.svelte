<script lang="ts">
	import ListItem from './ListItem.svelte';
	import type { ListItem as ListItemT } from './listItem';

	export let items: ListItemT[] | null,
		title: string | undefined = undefined;
</script>

<div class="w-full">
	{#if title}
		<h3 class="text-3xl p-1 text-center">{title}</h3>
	{/if}
	<div
		class="w-full h-full snap-x snap-mandatory scroll-smooth flex overflow-x-auto shadow-inherit"
	>
		<div class="flex-grow snap-start flex-shrink-0 w-1.5" />
		{#each items ?? Array(6) as item}
			<div class="snap-start flex-shrink-0 w-48 md:w-60 p-0.5">
				{#if item}
					<ListItem {item} />
				{:else}
					<div class="card h-96" />
				{/if}
			</div>
		{/each}
		<div class="flex-grow snap-start flex-shrink-0 w-1.5" />
	</div>
</div>
