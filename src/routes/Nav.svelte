<script lang="ts" context="module">
	const searchMode = writable(false),
		query = writable('');
	export function openSearch(searchTerm: string) {
		searchMode.set(true);
		query.set(searchTerm);
	}
</script>

<script lang="ts">
	import { AppBar, getDrawerStore } from '@skeletonlabs/skeleton';
	import {
		faBars,
		faCartShopping,
		faClose,
		faSearch
	} from '@fortawesome/free-solid-svg-icons/index';
	import Fa from 'svelte-fa';
	import { onNavigate } from '$app/navigation';
	import { writable } from 'svelte/store';
	import { getCartStore } from '$lib/cart/cartStore';

	searchMode.set(false);
	onNavigate(() => {
		searchMode.set(false);
	});

	const drawerStore = getDrawerStore();

	const cart = getCartStore();
	let cartSize: number | undefined;
	$: cartSize = $cart ? $cart.items.reduce((prev, v) => prev + v.quantity, 0) : undefined;
	let cartString: string;
	$: cartString = cartSize === undefined ? '' : cartSize >= 1000 ? '>999' : cartSize.toString();
</script>

{#if !$searchMode}
	<!-- App Bar -->
	<AppBar
		gridColumns="grid-cols-3"
		slotDefault="place-self-center"
		slotTrail="place-content-end"
		padding="p-1"
		shadow="shadow-md"
	>
		<svelte:fragment slot="lead">
			<button class="btn btn-icon-xl" on:click={() => drawerStore.open()}>
				<Fa icon={faBars} />
			</button>
		</svelte:fragment>
		<a href="/" class="rounded-sm p-1 bg-tertiary-100 text-tertiary-900 text-2xl font-semibold"
			>Vedge<span class="font-bold text-primary-500">kit</span></a
		>
		<svelte:fragment slot="trail">
			<div class="flex">
				<button
					class="btn btn-icon btn-icon-lg"
					on:click={() => {
						query.set('');
						searchMode.set(true);
					}}
				>
					<Fa icon={faSearch} />
				</button>
				<a class="btn btn-icon btn-icon-lg group" href="/cart" data-sveltekit-preload-code="eager">
					<Fa icon={faCartShopping} />
					<span
						class="variant-filled-primary rounded-md fixed {['w-4', 'w-4', 'w-5', 'w-7', 'w-9'][
							cartString.length
						]} h-4 mb-4 mr-0 ml-4 text-xs font-semibold grid place-content-center group-hover:opacity-25"
						>{cartString}</span
					>
				</a>
			</div>
		</svelte:fragment>
	</AppBar>
{:else}
	<AppBar padding="p-2 pr-0" gridColumns="grid-cols-1">
		<div class="flex w-full justify-center">
			<form
				action="/search"
				method="get"
				class="input-group input-group-divider grid-cols-[1fr_auto] flex-grow max-w-2xl"
			>
				<input
					type="text"
					name="query"
					bind:value={$query}
					id=""
					placeholder="Search Products"
					class="input px-6 py-2"
					autofocus
				/>
				<button class="variant-filled-primary"><Fa icon={faSearch} /> </button>
			</form>
			<button on:click={() => searchMode.set(false)} class="btn btn-icon-xl h-[55px] px-0">
				<Fa icon={faClose} />
			</button>
		</div>
	</AppBar>
	<button
		on:click={() => {
			searchMode.set(false);
		}}
		class="z-40 absolute variant-glass w-full h-full"
	/>
{/if}
