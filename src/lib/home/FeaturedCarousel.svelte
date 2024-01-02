<script lang="ts">
	import type { BannerImages } from '../../routes/api/home/featured.json/+server';
	import Fa from 'svelte-fa';
	import { faArrowLeft, faArrowRight } from '@fortawesome/free-solid-svg-icons';
	import { onDestroy, onMount } from 'svelte';

	export let bannerImages: BannerImages[];

	let elemCarousel: HTMLDivElement,
		lastMovementTime = 0;
	function carouselLeft(): void {
		lastMovementTime = Date.now();
		const x =
			elemCarousel.scrollLeft === 0
				? elemCarousel.clientWidth * elemCarousel.childElementCount // loop
				: elemCarousel.scrollLeft - elemCarousel.clientWidth; // step left
		elemCarousel.scroll(x, 0);
	}
	function carouselRight(): void {
		lastMovementTime = Date.now();
		const x =
			elemCarousel.scrollLeft === elemCarousel.scrollWidth - elemCarousel.clientWidth
				? 0 // loop
				: elemCarousel.scrollLeft + elemCarousel.clientWidth; // step right
		elemCarousel.scroll(x, 0);
	}

	let interval: string | number | NodeJS.Timeout | undefined;
	onMount(() => {
		interval = setInterval(() => {
			if (lastMovementTime + 4500 < Date.now()) {
				carouselRight();
			}
		}, 5000);
		interval;
	});

	onDestroy(() => {
		clearInterval(interval);
	});
</script>

<svelte:head>
	<link rel="preload" href={bannerImages[0].imageUrl} as="image" />
</svelte:head>

<div class="card grid items-center group relative">
	<div class="absolute h-full left-0 flex">
		<button
			type="button"
			class="hidden group-hover:flex btn-icon btn-icon-lg variant-glass rounded-none"
			on:click={carouselLeft}
		>
			<Fa icon={faArrowLeft} />
		</button>
	</div>
	<div class="absolute h-full right-0 flex">
		<div class="flex-grow" />
		<button
			type="button"
			class="hidden group-hover:flex btn-icon btn-icon-lg variant-glass rounded-none"
			on:click={carouselRight}
		>
			<Fa icon={faArrowRight} />
		</button>
	</div>
	<div
		bind:this={elemCarousel}
		class="w-full h-full snap-x snap-mandatory scroll-smooth flex overflow-x-auto"
	>
		{#each bannerImages ?? [] as { imageUrl, index }}
			<a href="/search?featured={index}" class="shrink-0 snap-center w-full aspect-[1805/351]">
				<img class="h-full w-full rounded-container-token px-0.5" src={imageUrl} alt="" />
			</a>
		{/each}
	</div>
</div>
