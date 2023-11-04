import type { LayoutServerLoad } from './$types';
import { SessionManager } from '$lib/server/session';

export const load: LayoutServerLoad = async ({ cookies }) => {
	const session = new SessionManager(cookies);

	return {
		streamed: { session: session.init(undefined, 'default', false) },
		writeSessionCookie: cookies.get('session') === undefined
	};
};
