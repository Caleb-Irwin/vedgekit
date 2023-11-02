import { redirect } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { getSession, type Session } from '../../api/session/session';

export const GET: RequestHandler = async ({ url, cookies }) => {
	const path = url.searchParams.get('url') ?? '';
	throw redirect(302, getUrl(path, (await getSession(cookies.get('session'))).contents as Session));
};

const getUrl = (path: string, session: Session) =>
	`https://proxy.vedgekit.calebirwin.ca/redirect?url=${encodeURIComponent('/' + path)}&session=${
		session.vSession
	}&rememberme=${session.vRememberme}`;
