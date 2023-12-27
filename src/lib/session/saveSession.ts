import { browser } from '$app/environment';

export async function saveSession({ sessionJwt }: { sessionJwt: Promise<string | undefined> }) {
	if (browser)
		await fetch('/api/session', {
			method: 'POST',
			headers: { session: (await sessionJwt) ?? '' }
		});
}
