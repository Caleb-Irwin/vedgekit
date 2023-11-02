<script lang="ts">
	import { ProgressRadial } from '@skeletonlabs/skeleton';
	import { fade } from 'svelte/transition';
	import type { getSession } from '../../api/session/session';

	export let path: string, session: ReturnType<typeof getSession>;
	let isLoading = true;
</script>

<div class="w-full h-full flex flex-col">
	{#if isLoading}
		<div
			transition:fade={{ duration: 300 }}
			id="animate-div"
			class="absolute w-full h-full grid place-content-center bg-white"
		>
			<div class="grid place-content-center p-4 card rounded-full">
				<ProgressRadial width="w-24" stroke={100} />
			</div>
		</div>
	{/if}
	{#await session then}
		<iframe
			title="Old Site"
			src={`/old/redirect?url=${encodeURIComponent(path)}`}
			frameborder="0"
			class="flex-grow bg-white {isLoading ? 'hidden' : ''} "
			on:load={() => {
				isLoading = false;
			}}
		/>
	{/await}
</div>

<style lang="postcss">
	#animate-div {
		animation-name: background;
		animation-duration: 2s;
	}
	@keyframes background {
		0% {
			background-color: #ffffff00;
		}
		100% {
			background-color: #ffffff;
		}
	}
</style>
