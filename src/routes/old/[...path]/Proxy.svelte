<script lang="ts">
	import { ProgressRadial, SlideToggle, Accordion, AccordionItem } from '@skeletonlabs/skeleton';
	import { fade } from 'svelte/transition';
	import injections from './injections?raw';
	import { onMount } from 'svelte';
	import { goto } from '$app/navigation';

	export let path: string,
		session: Promise<any>,
		hideControls = false,
		conf: Partial<ProxyState> = {};
	let src = `/old/redirect?url=${encodeURIComponent(path)}`,
		isLoading = true,
		firstLoad = true,
		iframe: HTMLIFrameElement | undefined;

	onMount(() => {
		window.addEventListener(
			'message',
			(event) => {
				const e = JSON.parse(event.data);
				switch (e?.cmd) {
					case 'done':
						updatePage();
						isLoading = false;
						path = e.data.url;
						break;
					case 'navigating':
						isLoading = true;
						break;
					case 'goto':
						goto(e.data.url);
						break;
					default:
						break;
				}
			},
			false
		);
	});

	interface ProxyState {
		showNavBar: boolean;
		showFooter: boolean;
		redirectProductPages: boolean;
		checkoutPage: boolean;
	}

	let proxyState: ProxyState = {
			showNavBar: true,
			showFooter: true,
			redirectProductPages: false,
			checkoutPage: false,
			...conf
		},
		initProxyState: ProxyState = {
			showNavBar: true,
			showFooter: true,
			redirectProductPages: false,
			checkoutPage: false
		},
		proxyStateCurrent = { ...initProxyState };

	function updatePage() {
		if (proxyStateCurrent.showNavBar !== proxyState.showNavBar) {
			sendMessage(proxyState.showNavBar ? 'show-nav' : 'hide-nav');
			proxyStateCurrent.showNavBar = proxyState.showNavBar;
		}
		if (proxyStateCurrent.showFooter !== proxyState.showFooter) {
			sendMessage(proxyState.showFooter ? 'show-footer' : 'hide-footer');
			proxyStateCurrent.showFooter = proxyState.showFooter;
		}
		if (
			proxyStateCurrent.redirectProductPages !== proxyState.redirectProductPages &&
			proxyState.redirectProductPages === true &&
			!isLoading
		) {
			sendMessage('redirect-product-pages');
			proxyStateCurrent.redirectProductPages = true;
		}
		if (
			proxyStateCurrent.checkoutPage !== proxyState.checkoutPage &&
			proxyState.checkoutPage === true
		) {
			sendMessage('redirect-on-order-done');
			proxyStateCurrent.checkoutPage = true;
		}
	}

	function inject() {
		iframe?.contentWindow?.postMessage(
			JSON.stringify({ inject: injections }),
			'https://proxy.vedgekit.calebirwin.ca'
		);
		firstLoad = false;
		proxyStateCurrent = { ...initProxyState };
	}

	function sendMessage(cmd: string, data: unknown = undefined) {
		iframe?.contentWindow?.postMessage(
			JSON.stringify({
				cmd,
				data
			}),
			'*'
		);
	}

	$: {
		if (!isLoading && proxyState) {
			updatePage();
		}
	}
</script>

<div class="w-full h-full flex flex-col bg-white">
	{#if isLoading}
		<div
			transition:fade={{ duration: 200 }}
			id=""
			class="absolute w-full h-full grid place-content-center variant-glass"
		>
			<div class="grid place-content-center p-4">
				<ProgressRadial />
			</div>
		</div>
	{/if}
	{#await session then}
		<iframe
			title="Old Site"
			{src}
			frameborder="0"
			class="flex-grow bg-white {isLoading ? 'hidden' : ''} "
			on:load={inject}
			bind:this={iframe}
		/>
		{#if !hideControls}
			<div class="absolute bottom-1 left-2 grid place-content-center p-2 card">
				<div>
					<Accordion>
						<AccordionItem>
							<svelte:fragment slot="summary">Controls</svelte:fragment>
							<svelte:fragment slot="content">
								<SlideToggle name="Show Nav Bar" bind:checked={proxyState.showNavBar}
									>Navbar</SlideToggle
								>
								<br />
								<SlideToggle name="Show Nav Bar" bind:checked={proxyState.showFooter}
									>Footer</SlideToggle
								>
							</svelte:fragment>
						</AccordionItem>
					</Accordion>
				</div>
			</div>
		{/if}
	{/await}
</div>

<style lang="postcss">
	.animate-fade {
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
