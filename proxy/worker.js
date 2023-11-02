const API_HOST = 'test.shopofficeonline.com',
	NEW_HOST = 'proxy.vedgekit.calebirwin.ca';

async function handleRequest(event) {
	const url = new URL(event.request.url);
	const pathname = url.pathname;
	const search = url.search;
	const pathWithParams = pathname + search;
	let res;
	if (pathname.startsWith('/redirect')) {
		const rememberme = url.searchParams.get('rememberme'),
			session = url.searchParams.get('session'),
			redirectUrl = url.searchParams.get('url') ?? '',
			headers = new Headers();

		headers.set('location', `https://${NEW_HOST}/${decodeURI(redirectUrl).slice(1)}`);
		headers.append(
			'set-cookie',
			`REMEMBERME=${rememberme}; Max-Age=1800; Expires=Mon, 30-Oct-2023 03:23:43 GMT; Path=/`
		);
		headers.append('set-cookie', `SESSION=${session}; Path=/; HttpOnly; SameSite=Lax`);

		res = new Response(null, {
			status: 302,
			headers
		});
	} else if (pathname.startsWith('/resources/')) {
		res = await fetch(`https://${API_HOST}${pathWithParams}`, new Request(event.request));
	} else {
		res = await fetch(`https://${API_HOST}${pathWithParams}`, new Request(event.request));
	}
	res = new Response(res.body, res);
	res.headers.delete('x-frame-options');
	res.headers.set(
		'content-security-policy',
		"frame-ancestors 'self' http://localhost:* https://vedgekit.calebirwin.ca;"
	);
	return res;
}

addEventListener('fetch', (event) => {
	event.passThroughOnException();
	event.respondWith(handleRequest(event));
});
