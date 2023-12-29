import type { Featured } from './+server';

export async function getFeatured(customFetch: typeof fetch) {
	const res = await customFetch('/api/home/featured.json');
	if (res.status !== 200) throw new Error('Could not get featured!');
	return (await res.json()) as Featured;
}
