<script lang="ts">
	import type { BannerImages } from '../../routes/api/home/featured.json/+server';
	import Fa from 'svelte-fa';
	import { faArrowLeft, faArrowRight } from '@fortawesome/free-solid-svg-icons';
	import { onMount } from 'svelte';

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

	onMount(() => {
		setInterval(() => {
			if (lastMovementTime + 4500 < Date.now()) {
				carouselRight();
			}
		}, 5000);
	});
</script>

<svelte:head>
	<link rel="preload" href={bannerImages[0].imageUrl} as="image" />
</svelte:head>

<div class="card grid items-center group relative">
	<div class="absolute h-full w-full flex items-center px-2">
		<button
			type="button"
			class="hidden group-hover:flex btn-icon btn-icon-lg variant-glass"
			on:click={carouselLeft}
		>
			<Fa icon={faArrowLeft} />
		</button>
		<div class="flex-grow" />
		<button
			type="button"
			class="hidden group-hover:flex btn-icon btn-icon-lg variant-glass"
			on:click={carouselRight}
		>
			<Fa icon={faArrowRight} />
		</button>
	</div>
	<div
		bind:this={elemCarousel}
		class="w-full h-full snap-x snap-mandatory scroll-smooth flex overflow-x-auto"
	>
		{#each bannerImages ?? [] as { imageUrl, searchUrl }}
			<a href="/old/{searchUrl}" class="shrink-0 snap-center w-full aspect-[1805/351]">
				<img class="h-full w-full rounded-container-token" src={imageUrl} alt="" loading="lazy" />
			</a>
		{/each}
	</div>
</div>
