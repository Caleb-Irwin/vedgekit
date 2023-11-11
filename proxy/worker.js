const API_HOST = 'shop.beatties.com',
	NEW_HOST = 'proxy.vedgekit.calebirwin.ca',
	VEDGEKIT_HOST = 'vedgekit.calebirwin.ca',
	ALLOW_LOCALHOST = true;

async function handleRequest(event) {
	const url = new URL(event.request.url),
		pathname = url.pathname,
		search = url.search,
		pathWithParams = pathname + search;

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
		headers.append('set-cookie', `SESSION=${session}; HttpOnly; Path=/`);

		res = new Response(null, {
			status: 302,
			headers
		});
	} else if (pathname.startsWith('/resources/')) {
		res = await fetch(`https://${API_HOST}${pathWithParams}`, new Request(event.request));
	} else {
		res = await fetch(`https://${API_HOST}${pathWithParams}`, new Request(event.request));
	}
	const newBody = (res.headers.get('content-type') ?? '').includes('text/html')
		? (await res.text()).slice() + inject(pathWithParams)
		: res.body;
	console.log(res.headers.get('content-type'));
	res = new Response(newBody, res);
	res.headers.delete('x-frame-options');
	res.headers.set(
		'content-security-policy',
		`frame-ancestors 'self' ${
			ALLOW_LOCALHOST ? 'http://localhost:*' : ''
		}  https://${VEDGEKIT_HOST};`
	);
	if (res.headers.get('location')?.includes(API_HOST))
		res.headers.set('location', res.headers.get('location').replace(API_HOST, NEW_HOST));
	return res;
}

addEventListener('fetch', (event) => {
	event.passThroughOnException();
	event.respondWith(handleRequest(event));
});

const inject = (fullUrl) => `<script>
const FULL_URL = '${fullUrl}';
window.addEventListener('message', function (event) {
	const { inject } = JSON.parse(event.data);
	if (
		(event.origin === 'https://${VEDGEKIT_HOST}' || event.origin.startsWith('http://localhost:')) &&
		inject
	)
		eval(inject);
});
</script>`;
