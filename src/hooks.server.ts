import { SessionManager } from '$lib/session/server';
import type { Handle } from '@sveltejs/kit';

export const handle: Handle = async ({ event, resolve }) => {
	event.locals.session = new SessionManager(event.cookies);
	if (event.route.id !== '/api/session') event.locals.session.init(undefined, 'default', false);

	const response = await resolve(event);
	return response;
};
