//@ts-expect-error In global score
const PAGE_URL = FULL_URL; // eslint-disable-line no-undef

/**
 * Send a message to parent
 * @param {string} cmd - Command
 * @param {object | undefined} data - Data
 */
function sendMessage(cmd, data = undefined) {
	window.parent.postMessage(
		JSON.stringify({
			cmd,
			data
		}),
		'*'
	);
}

sendMessage('done', { url: PAGE_URL });

window.onbeforeunload = function () {
	sendMessage('navigating');
};

window.addEventListener('message', (event) => {
	const e = JSON.parse(event.data);
	switch (e?.cmd) {
		case 'hide-nav':
			hideNav();
			break;
		case 'show-nav':
			showNav();
			break;
		case 'hide-footer':
			hideFooter();
			break;
		case 'show-footer':
			showFooter();
			break;
		case 'redirect-product-pages':
			redirectProductPages();
			break;
		default:
			break;
	}
});

function hideNav() {
	const h = document.getElementById('wcic_beatties_header');
	if (h) h.style.display = 'none';
}

function showNav() {
	const h = document.getElementById('wcic_beatties_header');
	if (h) h.style.display = '';
}

function hideFooter() {
	const h = document.getElementById('wci_footer');
	if (h) h.style.display = 'none';
}

function showFooter() {
	const h = document.getElementById('wci_footer');
	if (h) h.style.display = '';
}

function redirectProductPages() {
	document.querySelectorAll('a').forEach((item) => {
		try {
			const url = new URL(item.href);
			if (url.pathname === '/productdetails.do') {
				const sku = url.searchParams.get('sku') ?? '';
				item.addEventListener('click', (event) => {
					event.preventDefault();
					sendMessage('goto', { url: '/product/' + encodeURIComponent(sku) });
				});
			}
		} catch (e) {
			return;
		}
	});
}
