<script lang="ts">
	import { faSearch } from '@fortawesome/free-solid-svg-icons/index';
	import Fa from 'svelte-fa';
</script>

<div class="container h-full w-full flex justify-center items-center">
	<div class="w-full space-y-10 text-center flex flex-col items-center p-2">
		<section class="img-bg" />
		<h2 class="text-4xl">Vedgekit.</h2>
		<form
			action="/search"
			method="get"
			class="input-group input-group-divider grid-cols-[1fr_auto]"
		>
			<input
				type="text"
				name="query"
				id=""
				placeholder="Search Products"
				class="input p-4 text-lg"
			/>
			<button class="variant-filled-primary text-lg"><Fa icon={faSearch} /> </button>
		</form>
	</div>
</div>

<style lang="postcss">
	figure {
		@apply flex relative flex-col;
	}
	figure svg,
	.img-bg {
		@apply w-64 h-64 md:w-80 md:h-80;
	}
	.img-bg {
		@apply absolute z-[-1] rounded-full blur-[50px] transition-all;
		animation: pulse 5s cubic-bezier(0, 0, 0, 0.5) infinite, glow 5s linear infinite;
	}
	@keyframes glow {
		0% {
			@apply bg-primary-400/50;
		}
		33% {
			@apply bg-secondary-400/50;
		}
		66% {
			@apply bg-tertiary-400/50;
		}
		100% {
			@apply bg-primary-400/50;
		}
	}
	@keyframes pulse {
		50% {
			transform: scale(1.5);
		}
	}
</style>
