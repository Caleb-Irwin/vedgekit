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

	import { initializeStores } from '@skeletonlabs/skeleton';
	import type { AfterNavigate } from '@sveltejs/kit';
	import { initCartStore } from '$lib/cart/cartStore';
	import { PUBLIC_V_HOST, PUBLIC_ANALYTICS } from '$env/static/public';
	import { dev } from '$app/environment';
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

	<svelte:fragment slot="pageFooter">
		<div class="w-full variant-glass-surface mt-2 p-1">
			<p class="text-center">
				Created by <a
					href="http://calebirwin.ca/"
					target="_blank"
					rel="noopener noreferrer"
					class="underline">Caleb Irwin</a
				>.

				<br />
				This is a test site for demonstration purposes.
				<br />
				Powered by
				<a href="https://www.venxia.ca/" target="_blank" rel="noopener noreferrer" class="underline"
					><span class="font-bold">V</span>enxia</a
				>,
				<a
					href="https://www.cloudflare.com/developer-platform/workers/"
					target="_blank"
					rel="noopener noreferrer"
					class="underline">Cloudflare's <span class="font-bold">Edge</span> Workers</a
				>, and
				<a
					href="https://kit.svelte.dev/"
					target="_blank"
					rel="noopener noreferrer"
					class="underline">Svelte<span class="font-bold">Kit</span></a
				>. Based on
				<a href={PUBLIC_V_HOST} target="_blank" rel="noopener noreferrer" class="underline"
					>{new URL(PUBLIC_V_HOST).hostname}</a
				>. View on
				<a
					href="https://github.com/Caleb-Irwin/vedgekit/"
					target="_blank"
					rel="noopener noreferrer"
					class="underline">GitHub</a
				>.
			</p>
		</div>
	</svelte:fragment>
</AppShell>

{dev ? '' : PUBLIC_ANALYTICS}
