import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';

export const POST: RequestHandler = async ({ locals: { session }, url, request }) => {
	return json(
		await session.init(
			request.headers.get('session') ?? undefined,
			(url.searchParams.get('mode') ?? 'default') as 'default' | 'refresh' | 'new'
		)
	);
};
