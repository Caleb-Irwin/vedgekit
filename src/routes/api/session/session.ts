import jwt from '@tsndr/cloudflare-worker-jwt';

export interface SessionPayload {
	vSession: string;
	vRememberme: string;
	vAuthorization: string;
	vUserId: string;
	vStoreId: string;
	lang: 'en' | 'fr';
}

export interface Session extends SessionPayload {
	iat: number;
}

const jwtSecret = 'secret';

export async function getSessionFromToken(token: string): Promise<Session | null> {
	try {
		const isValid = await jwt.verify(token, jwtSecret);
		if (!isValid) return null;
		const { payload } = jwt.decode(token);
		if (payload.vSession && payload.vRememberme && payload.vAuthorization)
			return payload as Session;
		else return null;
	} catch (e) {
		return null;
	}
}

export async function getSession(
	token: string = '',
	mode: 'default' | 'refresh' | 'new' = 'default'
): Promise<{ jwt: string | null; contents?: Session }> {
	const orginalToken = token,
		orginalSession = mode === 'new' ? null : await getSessionFromToken(orginalToken);
	if (orginalSession && mode !== 'refresh') return { jwt: orginalToken, contents: orginalSession };

	const res = await fetch('https://test.shopofficeonline.com/', {
			headers: {
				cookie:
					orginalSession !== null && mode !== 'new'
						? `REMEMBERME=${orginalSession?.vRememberme}; SESSION=${orginalSession?.vSession}`
						: ''
			}
		}),
		text = await res.text();

	const setCookieStr = res.headers.getSetCookie().join('\n'),
		rememberme = /REMEMBERME=([\d\w-]+);/.exec(setCookieStr)?.[1] ?? '',
		session = /SESSION=([\d\w-]+);/.exec(setCookieStr)?.[1] ?? orginalSession?.vSession ?? '',
		authorization = /Bearer .+?(?=')/.exec(text)?.[0] ?? '',
		userId = /addItemToCart\(.*?,.*?,.*?,\\'(\d+).*?\)/.exec(text)?.[1] ?? '',
		storeId = /addItemToCart\(\\'(\d+).*?\)/.exec(text)?.[1] ?? '';

	if (!(rememberme?.length > 0 && session?.length > 0 && authorization?.length > 0))
		return { jwt: null };

	const tokenPayload: SessionPayload = {
		vSession: session,
		vRememberme: rememberme,
		vAuthorization: authorization,
		vUserId: userId,
		vStoreId: storeId,
		lang: 'en'
	};
	return {
		jwt: await jwt.sign(tokenPayload, jwtSecret),
		contents: tokenPayload as Session
	};
}
