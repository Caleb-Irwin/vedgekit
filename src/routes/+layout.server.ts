import type { LayoutServerLoad } from './$types';
import { getSession } from './api/session/session';

export const load: LayoutServerLoad = async ({ cookies }) => {
	const session = getSession(cookies.get('session'));

	return {
		streamed: { session },
		writeSessionCookie: cookies.get('session') === undefined
	};
};
