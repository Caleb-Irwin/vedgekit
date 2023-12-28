<script lang="ts">
	import Fa from 'svelte-fa';
	import { faCheck, faCircleNotch, faCartShopping } from '@fortawesome/free-solid-svg-icons';

	import { enhance } from '$app/forms';
	export let sku: string,
		large = false;

	let qty = 1,
		updatingQuantity = false,
		success = false;
</script>

<form
	use:enhance={() => {
		updatingQuantity = true;
		success = false;
		return async ({ update }) => {
			success = true;
			await update({ reset: false, invalidateAll: false });
			qty = 1;
			updatingQuantity = false;
		};
	}}
	method="post"
	action="/cart?/add"
	class="flex flex-row justify-center flex-wrap space-y-1"
>
	<div
		class="mx-2 btn-group {success
			? 'variant-outline-primary'
			: qty && qty >= 1
			? 'variant-outline-tertiary'
			: 'variant-outline-error'}"
	>
		<input type="hidden" name="sku" value={sku} />
		<input type="hidden" name="quantity" value={qty} />
		<button
			class="border-r-0 w-10 font-semibold"
			disabled={qty <= 1 || updatingQuantity}
			on:click|preventDefault={() => {
				success = false;
				qty--;
			}}>-</button
		>
		<input
			class="quantity-input w-12 p-0 bg-transparent border-x-0 border-y-[1px] {success
				? 'border-primary-500'
				: qty && qty >= 1
				? 'border-tertiary-500'
				: 'border-error-500'}  text-center remove-arrow"
			type="number"
			size="4"
			bind:value={qty}
			on:change={() => (success = false)}
			disabled={updatingQuantity}
		/>
		<button
			class="border-l-0 w-10 font-semibold"
			on:click|preventDefault={() => {
				success = false;
				qty++;
			}}
			disabled={updatingQuantity}>+</button
		>
	</div>
	<button
		class="btn {!large ? 'btn-icon' : ''} {large || (!large && success)
			? 'variant-filled-primary'
			: 'variant-filled-secondary'}"
		disabled={updatingQuantity}
	>
		{#if success}
			<Fa icon={faCheck} />
		{:else if updatingQuantity}
			<span class="animate-spin">
				<Fa icon={faCircleNotch} />
			</span>
		{:else}
			<Fa icon={faCartShopping} />
		{/if}
		{#if large}
			<span>Add to cart</span>
		{/if}
	</button>
</form>

<style lang="postcss">
	.remove-arrow::-webkit-inner-spin-button,
	.remove-arrow::-webkit-outer-spin-button {
		-webkit-appearance: none;
		margin: 0;
	}
	.remove-arrow {
		-moz-appearance: textfield;
	}
</style>
