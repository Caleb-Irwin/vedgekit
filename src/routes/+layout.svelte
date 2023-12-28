<script lang="ts">
	import '../app.postcss';
	import { AppShell, AppBar, LightSwitch, ProgressRadial } from '@skeletonlabs/skeleton';

	// Floating UI for Popups
	import { computePosition, autoUpdate, flip, shift, offset, arrow } from '@floating-ui/dom';
	import { storePopup } from '@skeletonlabs/skeleton';
	storePopup.set({ computePosition, autoUpdate, flip, shift, offset, arrow });

	import type { LayoutData } from './$types';
	import { saveSession } from '$lib/session/saveSession';
	import { navigating } from '$app/stores';
	import { fade } from 'svelte/transition';
	import { afterNavigate } from '$app/navigation';
	import Nav from './Nav.svelte';

	export let data: LayoutData;
	saveSession(data);

	afterNavigate(() => {
		document.getElementById('page')?.scrollTo(0, 0);
	});
</script>

<!-- App Shell -->
<AppShell>
	<svelte:fragment slot="header">
		<Nav />
	</svelte:fragment>

	<div id="page" class="h-0 w-full" />

	{#if $navigating}
		<div
			transition:fade={{ duration: 200 }}
			class="z-50 absolute variant-glass w-full h-full grid place-content-center"
		>
			<ProgressRadial />
		</div>
	{/if}

	<!-- Page Route Content -->
	<slot />
</AppShell>
