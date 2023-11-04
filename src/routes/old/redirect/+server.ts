import { redirect } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { SessionManager, type Session } from '$lib/server/session';

export const GET: RequestHandler = async ({ url, cookies }) => {
	const session = new SessionManager(cookies);
	await session.init();
	const path = url.searchParams.get('url') ?? '';
	throw redirect(302, getUrl(path, session.s));
};

const getUrl = (path: string, session: Session) =>
	`https://proxy.vedgekit.calebirwin.ca/redirect?url=${encodeURIComponent('/' + path)}&session=${
		session.vSession
	}&rememberme=${session.vRememberme}`;
