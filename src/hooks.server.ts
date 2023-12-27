import { SessionManager } from '$lib/server/session';
import type { Handle } from '@sveltejs/kit';

export const handle: Handle = async ({ event, resolve }) => {
	event.locals.session = new SessionManager(event.cookies);
	event.locals.session.init(undefined, 'default', false);

	const response = await resolve(event);
	return response;
};
