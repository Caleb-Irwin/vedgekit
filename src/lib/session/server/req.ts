import type { Session } from './';
import { PUBLIC_V_HOST } from '$env/static/public';

export interface ReqConf {
	authorization?: null | string;
	cookies?: {
		session?: null | string;
		rememberme?: null | string;
		others?: string;
	} | null;
	query?: {
		storeId?: null | string;
		langId?: null | 'en' | 'fr';
		userId?: null | string;
		cartId?: null | string;
		deptId?: null | '0';
	} | null;
	customQuery?: {
		[name: string]: string;
	};
}

export async function req(
	path: string,
	session: Session,
	reqInit?: RequestInit<RequestInitCfProperties>,
	conf: ReqConf = {},
	customFetch?: typeof fetch
) {
	const url = new URL(PUBLIC_V_HOST);
	url.pathname = path;
	if (conf.query !== null) {
		conf.query?.storeId !== null &&
			url.searchParams.append('storeId', conf.query?.storeId ?? session.vStoreId);
		conf.query?.langId !== null &&
			url.searchParams.append('langId', conf.query?.langId ?? session.lang);
		conf.query?.userId !== null &&
			url.searchParams.append('userId', conf.query?.userId ?? session.vUserId);
		conf.query?.cartId !== null &&
			url.searchParams.append('cartId', conf.query?.cartId ?? session.vCartId ?? '0');
		conf.query?.deptId !== null && url.searchParams.append('deptId', conf.query?.deptId ?? '0');
	}
	if (conf.customQuery) {
		Object.keys(conf.customQuery).forEach((name) => {
			// @ts-expect-error can not be undefined
			url.searchParams.append(name, conf.customQuery[name]);
		});
	}
	const req = new Request(url, reqInit);
	if (conf.authorization !== null)
		req.headers.set('authorization', conf.authorization ?? session.vAuthorization);
	if (conf.cookies !== null)
		req.headers.set(
			'cookie',
			`REMEMBERME=${conf.cookies?.rememberme ?? session.vRememberme}; SESSION=${
				conf.cookies?.session ?? session.vSession
			}${conf.cookies?.others ? ';' + conf.cookies?.others : ''}`
		);
	return await (customFetch ?? fetch)(req);
}
