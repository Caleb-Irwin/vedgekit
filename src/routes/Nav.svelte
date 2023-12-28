<script lang="ts">
	import { AppBar } from '@skeletonlabs/skeleton';
	import {
		faBars,
		faCartShopping,
		faClose,
		faSearch
	} from '@fortawesome/free-solid-svg-icons/index';
	import Fa from 'svelte-fa';
	import { onNavigate } from '$app/navigation';
	import { enhance } from '$app/forms';

	let searchMode = false;
	onNavigate(() => {
		searchMode = false;
	});
</script>

{#if !searchMode}
	<!-- App Bar -->
	<AppBar
		gridColumns="grid-cols-3"
		slotDefault="place-self-center"
		slotTrail="place-content-end"
		padding="p-1"
	>
		<svelte:fragment slot="lead">
			<button class="btn btn-icon-xl">
				<Fa icon={faBars} />
			</button>
		</svelte:fragment>
		<a href="/" class="rounded-sm p-1 bg-tertiary-200 text-tertiary-900 text-2xl font-semibold"
			>Vedge<span class="font-bold text-primary-500">kit</span></a
		>
		<svelte:fragment slot="trail">
			<!-- <LightSwitch /> -->
			<div class="flex">
				<button class="btn btn-icon btn-icon-lg" on:click={() => (searchMode = true)}>
					<Fa icon={faSearch} />
				</button>
				<a class="btn btn-icon btn-icon-lg" href="/cart">
					<Fa icon={faCartShopping} />
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
					id=""
					placeholder="Search Products"
					class="input py-2"
					autofocus
				/>
				<button class="variant-filled-primary"><Fa icon={faSearch} /> </button>
			</form>
			<button on:click={() => (searchMode = false)} class="btn btn-icon-xl h-[55px] px-0">
				<Fa icon={faClose} />
			</button>
		</div>
	</AppBar>
	<button
		on:click={() => {
			searchMode = false;
		}}
		class="z-40 absolute variant-glass w-full h-full"
	/>
{/if}
