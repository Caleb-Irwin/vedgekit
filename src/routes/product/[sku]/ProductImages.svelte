<script lang="ts">
	export let images: { src: string; alt: string }[] | null;
	let imageIndex = 0;
	$: largeImage = images ? images[imageIndex] : null;
</script>

<div class="w-full">
	<div class="p-1">
		<div class="w-full aspect-square p-1 card {!images ? 'animate-pulse' : ''}">
			{#if largeImage}
				<img src={largeImage.src} alt={largeImage.alt} class="w-full rounded-sm" loading="lazy" />
			{/if}
		</div>
	</div>
	{#if images && images.length > 1}
		<div class="grid grid-cols-4">
			{#each images ?? [] as { src, alt }, i}
				<div class="p-1">
					<button
						class="w-full aspect-square p-1 card {imageIndex === i
							? 'cursor-default variant-ghost'
							: ' cursor-pointer'}"
						on:click={() => (imageIndex = i)}
					>
						<img
							{src}
							{alt}
							class="w-full rounded-sm {imageIndex === i ? 'cursor-default' : ' cursor-pointer'}"
							loading="lazy"
						/>
					</button>
				</div>
			{/each}
		</div>
	{/if}
</div>
