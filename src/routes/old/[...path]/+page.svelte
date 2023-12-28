<script lang="ts">
	import Proxy from './Proxy.svelte';

	import type { PageData } from './$types';
	export let data: PageData;
</script>

<svelte:head>
	<title>Old Site</title>
</svelte:head>

{#key data.path}
	<Proxy path={data.path} session={data.sessionJwt} />
{/key}
