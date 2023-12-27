<script lang="ts">
	import Proxy from '../../old/[...path]/Proxy.svelte';
	import type { PageData } from './$types';

	export let data: PageData;
</script>

{#key data.path}
	<Proxy path={data.path} session={data.sessionJwt} hideControls />
{/key}
