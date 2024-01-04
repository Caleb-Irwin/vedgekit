<script lang="ts">
	import { checkOutUrl } from '$lib/cart/checkOutUrl';
	import Proxy from '../../old/[...path]/Proxy.svelte';

	import type { PageData } from './$types';
	export let data: PageData;
</script>

<svelte:head>
	<title>Checkout</title>
</svelte:head>

<Proxy
	path={checkOutUrl()}
	session={data.sessionJwt}
	hideControls={true}
	conf={{ showFooter: false, showNavBar: false, checkoutPage: true }}
/>
