import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { SessionManager } from '$lib/server/session';

export const POST: RequestHandler = async ({ cookies, url, request }) => {
	const session = new SessionManager(cookies);
	return json(
		await session.init(
			request.headers.get('session') ?? undefined,
			(url.searchParams.get('mode') ?? 'default') as 'default' | 'refresh' | 'new'
		)
	);
};
