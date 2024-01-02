<script lang="ts">
	import ListItem from './ListItem.svelte';
	import type { ListItem as ListItemT } from './listItem';

	export let items: ListItemT[],
		title: string | undefined = undefined;
</script>

<div class="w-full">
	{#if title}
		<h3 class="text-3xl p-1">{title}</h3>
	{/if}
	<div class="w-full h-full snap-x snap-mandatory scroll-smooth flex overflow-x-auto">
		<div class="flex-grow" />
		{#each items as item}
			<div class="snap-start flex-shrink-0 w-48 md:w-60 p-0.5">
				<ListItem {item} />
			</div>
		{/each}
		<div class="flex-grow" />
	</div>
</div>
