import type { ListItem } from '$lib/itemList/listItem';
import { writable } from 'svelte/store';
import type { simpleSearch } from './SimpleSearch.server';

export function searchStore(params: string) {
	const { subscribe, set, update } = writable<{ page: number; items: ListItem[] }[]>([
		{ page: 0, items: [] }
	]);

	const addPage = (items: ListItem[], page: number) => {
		update((pages) => {
			pages[page] = { page, items };
			return pages;
		});
	};

	return {
		subscribe,
		addPage,
		clear: () => set([]),
		getPage: async (page: number) => {
			addPage([], page);

			const fetchRes = await fetch(`/search/page?page=${page}&${params}`);
			if (fetchRes.status !== 200) {
				alert('Failed to get more search results!');
				return;
			}

			const items = ((await fetchRes.json()) as Awaited<ReturnType<typeof simpleSearch>>).search
				.items;

			addPage(items, page);
		}
	};
}
