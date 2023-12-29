<script lang="ts">
	import {
		faClose,
		faHome,
		faLanguage,
		faNewspaper,
		faPersonCane
	} from '@fortawesome/free-solid-svg-icons';
	import { Drawer, LightSwitch, getDrawerStore } from '@skeletonlabs/skeleton';
	import Fa from 'svelte-fa';

	const drawerStore = getDrawerStore();
</script>

<Drawer width="w-72" zIndex="z-[100]">
	<div class="w-full flex flex-row items-center h-[69px]">
		<button
			class="aspect-square h-full grid place-content-center"
			on:click={() => drawerStore.close()}
		>
			<div class="btn btn-icon btn-icon-xl"><Fa icon={faClose} /></div>
		</button>
		<div class=" flex-grow" />
		<div class="aspect-square h-full grid place-content-center">
			<LightSwitch />
		</div>
	</div>
	<hr />
	<nav class="list-nav p-4">
		<ul>
			<li>
				<a href="/" on:click={() => drawerStore.close()}
					><Fa icon={faHome} class="pr-2 w-6" /> Home</a
				>
			</li>
			<li>
				<a
					href="/old/flyers.do?cc={'{vStoreId}'}&langId={'{lang}'}&vedgekit-minimal"
					on:click={() => drawerStore.close()}><Fa icon={faNewspaper} class="pr-2 w-6" /> Flyers</a
				>
			</li>
			<li>
				<a href="/old" on:click={() => drawerStore.close()}
					><Fa icon={faPersonCane} class="pr-2 w-6" /> Old Website</a
				>
			</li>
			<li>
				<a href="/old/home.do?cc={'{vStoreId}'}&langId=fr" on:click={() => drawerStore.close()}
					><Fa icon={faLanguage} class="pr-2 w-6" /> French</a
				>
			</li>
		</ul>
	</nav>
</Drawer>
