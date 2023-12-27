import type { LayoutServerLoad } from './$types';
export const load: LayoutServerLoad = async ({ cookies, locals: { session } }) => {
	return {
		streamed: { session: session.ready },
		writeSessionCookie: cookies.get('session') === undefined
	};
};
