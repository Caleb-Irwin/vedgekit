<script lang="ts">
	import Fa from 'svelte-fa';
	import { faCheckCircle, faHome } from '@fortawesome/free-solid-svg-icons';
	import type { PageData } from './$types';
	import { getCartStore } from '$lib/cart/cartStore';

	export let data: PageData;
	const cart = getCartStore();
	data.cart.then((c) => cart.updateCart(c));
</script>

<svelte:head>
	<title>Order Successful</title>
</svelte:head>

<div class="w-full h-full grid place-content-center">
	<div class="flex flex-col justify-center items-center card p-8">
		<Fa size="4x" icon={faCheckCircle} class="text-primary-500" />
		<h1 class="h1 text-primary-500 font-semibold p-2">Order Successful</h1>
		<h2 class="h3 pt-2 pb-4 text-center">
			Your order number is <span class="font-semibold">{data.number}</span>
		</h2>
		<a href="/" class="btn btn-lg variant-filled-surface"
			><Fa size={'sm'} class="pr-2" icon={faHome} /> Home</a
		>
	</div>
</div>
