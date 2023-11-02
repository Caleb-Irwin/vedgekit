<script lang="ts">
	import Proxy from './Proxy.svelte';

	import type { PageData } from './$types';
	export let data: PageData;
</script>

<Proxy path={data.path} session={data.streamed.session} />
