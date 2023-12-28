<script lang="ts">
	import Proxy from './Proxy.svelte';

	import type { PageData } from './$types';
	export let data: PageData;
</script>

<svelte:head>
	<title>Old Site</title>
</svelte:head>

<Proxy path={data.path} session={data.sessionJwt} />
