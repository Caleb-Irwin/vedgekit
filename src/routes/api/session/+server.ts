import { error, json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { getSession } from './session';

export const POST: RequestHandler = async ({ cookies, url, request }) => {
	const { jwt, contents } = await getSession(
		request.headers.get('session') ?? cookies.get('session'),
		(url.searchParams.get('mode') ?? 'default') as 'default' | 'refresh' | 'new'
	);
	if (jwt == null) throw error(500, 'Failed to create session!');
	cookies.set('session', jwt, { path: '/' });
	return json({ jwt, contents });
};
