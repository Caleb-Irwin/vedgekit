import type { Cookies } from '@sveltejs/kit';
import setCookieParser from 'set-cookie-parser';
import jwt from '@tsndr/cloudflare-worker-jwt';
import { req, type ReqConf } from './req';
import { V_HOST, JWT_SECRET, REQUIRE_AUTHORIZATION_HEADER } from '$env/static/private';

export interface SessionPayload {
	vSession: string;
	vRememberme: string;
	vAuthorization: string;
	vUserId: string;
	vStoreId: string;
	vCartId: null | string;
	lang: 'en' | 'fr';
}

export interface Session extends SessionPayload {
	iat: number;
}

async function getSessionFromToken(token: string): Promise<Session | null> {
	try {
		const isValid = await jwt.verify(token, JWT_SECRET);
		if (!isValid) return null;
		const { payload } = jwt.decode(token);
		if (
			payload.vSession &&
			payload.vRememberme &&
			(!JSON.parse(REQUIRE_AUTHORIZATION_HEADER) || payload.vAuthorization)
		)
			return payload as Session;
		else return null;
	} catch (e) {
		return null;
	}
}

async function getSession(
	token: string = '',
	mode: 'default' | 'refresh' | 'new' = 'default'
): Promise<{ jwt: string | null; contents?: Session }> {
	const orginalToken = token,
		orginalSession = mode === 'new' ? null : await getSessionFromToken(orginalToken);
	if (orginalSession && mode !== 'refresh') return { jwt: orginalToken, contents: orginalSession };

	const res = await fetch(V_HOST, {
			headers: {
				cookie:
					orginalSession !== null && mode !== 'new'
						? `REMEMBERME=${orginalSession?.vRememberme}; SESSION=${orginalSession?.vSession}`
						: ''
			}
		}),
		text = await res.text();

	const setCookies = setCookieParser(res.headers.getSetCookie(), {
			map: true
		}),
		rememberme = setCookies.REMEMBERME?.value ?? orginalSession?.vRememberme,
		session = setCookies.SESSION?.value ?? orginalSession?.vSession,
		authorization = /Bearer .+?(?=')/.exec(text)?.[0] ?? '',
		userId = /addItemToCart\(.*?,.*?,.*?,\\'(\d+).*?\)/.exec(text)?.[1] ?? '',
		storeId = /addItemToCart\(\\'(\d+).*?\)/.exec(text)?.[1] ?? '',
		cartId = orginalSession?.vCartId ?? null;

	if (
		!(
			rememberme?.length > 0 &&
			session?.length > 0 &&
			(!JSON.parse(REQUIRE_AUTHORIZATION_HEADER) || authorization?.length > 0)
		)
	)
		return { jwt: null };

	const tokenPayload: SessionPayload = {
		vSession: session,
		vRememberme: rememberme,
		vAuthorization: authorization,
		vUserId: userId,
		vStoreId: storeId,
		vCartId: cartId,
		lang: 'en'
	};
	return {
		jwt: await jwt.sign(tokenPayload, JWT_SECRET),
		contents: tokenPayload as Session
	};
}

export class SessionManager {
	private inited: boolean = false;
	private session: Session | undefined;
	private jwt: string | undefined;
	private cookies: Cookies;
	private storeCookies: boolean;

	constructor(cookies: Cookies, storeCookies: boolean = true) {
		this.cookies = cookies;
		this.storeCookies = storeCookies;
	}

	async init(token?: string, mode: 'default' | 'refresh' | 'new' = 'default', store = true) {
		const sessionFull = await getSession(token ?? this.cookies.get('session'), mode);
		if (sessionFull.contents === undefined || sessionFull.jwt === null)
			throw new Error('Failed to create session');
		this.session = sessionFull.contents;
		this.jwt = sessionFull.jwt;
		this.inited = true;
		store && this.store();
		return { s: this.session, jwt: this.jwt };
	}

	private store() {
		if (this.storeCookies) this.cookies.set('session', this.jwt as string, { path: '/' });
	}

	get s() {
		if (!this.inited) throw new Error('Must init() first!');
		return this.session as Session;
	}

	get JWT() {
		return this.jwt;
	}

	async updateSession(partialSession: Partial<Session>) {
		if (!this.inited) throw new Error('Must init() first!');
		const originalSession = { ...this.session } as Session,
			newSession: SessionPayload = {
				...originalSession,
				...partialSession,
				//@ts-expect-error jwt.sign() will add back
				iat: undefined
			},
			newJwt = await jwt.sign(newSession, JWT_SECRET);

		if (originalSession.vSession !== newSession.vSession) {
			await this.init(newJwt, 'refresh');
		} else {
			this.session = newSession as Session;
			this.jwt = newJwt as string;
			this.store();
		}
	}

	private async updateFromResponse(res: Response) {
		if (!this.inited) throw new Error('Must init() first!');
		const setCookies = setCookieParser(res.headers.getSetCookie(), {
			map: true
		});

		if (setCookies.SESSION?.value) {
			await this.updateSession({
				vSession: setCookies.SESSION?.value,
				vRememberme: setCookies.REMEMBERME?.value ?? this.s.vRememberme
			});
		} else if (setCookies.REMEMBERME?.value) {
			await this.updateSession({
				vRememberme: setCookies.REMEMBERME?.value
			});
		}
	}

	async req(
		path: string,
		reqInit?: RequestInit<RequestInitCfProperties>,
		conf?: ReqConf,
		customFetch?: typeof fetch
	) {
		if (!this.inited) throw new Error('Must init() first!');
		const res = await req(path, this.session as Session, reqInit, conf, customFetch);
		await this.updateFromResponse(res);
		return res;
	}
}
