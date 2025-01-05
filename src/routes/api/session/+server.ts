import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';

export const POST: RequestHandler = async ({ locals: { session }, url, request }) => {
	await session.init(
		request.headers.get('session') ?? undefined,
		(url.searchParams.get('mode') ?? 'default') as 'default' | 'refresh' | 'new'
	);

	return json({
		jwt: session.JWT,
		s: session.s
	});
};

export const GET: RequestHandler = async ({ locals: { session } }) => {
	await session.init();
	return json(session.s);
};
