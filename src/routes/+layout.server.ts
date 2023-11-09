import type { LayoutServerLoad } from './$types';
import { SessionManager } from '$lib/server/session';

export const load: LayoutServerLoad = async ({ cookies }) => {
	const session = new SessionManager(cookies, false);

	return {
		streamed: { session: session.init() },
		writeSessionCookie: cookies.get('session') === undefined
	};
};
