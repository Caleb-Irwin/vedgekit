import { redirect } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { SessionManager, type Session } from '$lib/server/session';

export const GET: RequestHandler = async ({ url, cookies }) => {
	const session = new SessionManager(cookies);
	await session.init();
	const urlParam = decodeURIComponent(url.searchParams.get('url') ?? '/');
	const path = new URL(urlParam[0] === '/' ? urlParam : '/' + urlParam, 'http://localhost');
	path.searchParams.forEach((val, key) => {
		switch (val) {
			case '{lang}':
				path.searchParams.set(key, session.s.lang);
				break;
			case '{vCartId}':
				path.searchParams.set(key, session.s.vCartId ?? '0');
				break;

			case '{vStoreId}':
				path.searchParams.set(key, session.s.vStoreId);
				break;
			default:
				break;
		}
	});
	throw redirect(302, getUrl(path, session.s));
};

const getUrl = (url: URL, session: Session) =>
	`https://proxy.vedgekit.calebirwin.ca/redirect?url=${encodeURIComponent(
		url.pathname + url.search
	)}&session=${session.vSession}&rememberme=${session.vRememberme}`;
