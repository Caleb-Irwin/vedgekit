import { browser } from '$app/environment';

export async function saveSession({ sessionJwt }: { sessionJwt: Promise<string | undefined> }) {
	if (!browser) return;
	const session = await sessionJwt;
	if (session)
		await fetch('/api/session', {
			method: 'POST',
			headers: { session }
		});
}
