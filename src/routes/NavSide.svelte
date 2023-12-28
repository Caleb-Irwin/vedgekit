<script lang="ts">
	import { Drawer, LightSwitch, getDrawerStore } from '@skeletonlabs/skeleton';

	const drawerStore = getDrawerStore();
</script>

<Drawer>
	<h2 class="p-4 h2 flex flex-row items-center h-[70px]">
		Menu <span class="flex-grow" />
		<LightSwitch />
	</h2>
	<hr />
	<nav class="list-nav p-4">
		<ul>
			<li />
			<li><a href="/" on:click={() => drawerStore.close()}>Home</a></li>
			<li>
				<a
					href="/old/flyers.do?cc={'{vStoreId}'}&langId={'{lang}'}"
					on:click={() => drawerStore.close()}>Flyers</a
				>
			</li>
			<li><a href="/old" on:click={() => drawerStore.close()}>Old Website</a></li>
			<li>
				<a href="/old/home.do?cc={'{vStoreId}'}&langId=fr" on:click={() => drawerStore.close()}
					>French</a
				>
			</li>
		</ul>
	</nav>
</Drawer>
