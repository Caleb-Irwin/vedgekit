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
	import NavSide from './NavSide.svelte';

	export let data: LayoutData;
	saveSession(data);

	import { initializeStores, Drawer } from '@skeletonlabs/skeleton';
	import type { AfterNavigate } from '@sveltejs/kit';
	import { initCartStore } from '$lib/cart/cartStore';
	initializeStores();

	afterNavigate((params: AfterNavigate) => {
		const isNewPage = params.from?.url !== params.to?.url;
		const elemPage = document.querySelector('#page');
		if (isNewPage && elemPage !== null) {
			elemPage.scrollTop = 0;
		}
	});

	const cart = initCartStore();
	data.cart.then((c) => cart.updateCart(c));
</script>

<NavSide />

<!-- App Shell -->
<AppShell slotSidebarLeft="bg-surface-500/5 ">
	<svelte:fragment slot="header">
		<Nav />
	</svelte:fragment>

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
