// See https://kit.svelte.dev/docs/types#app
// for information about these interfaces

import type { SessionManager } from '$lib/session/server';

// and what to do when importing types
declare global {
	declare namespace App {
		interface Locals {
			session: SessionManager;
		}
		// interface PageData {}
		// interface Error {}
		// interface Platform {}
	}

	declare module '@fortawesome/free-solid-svg-icons/index' {
		export * from '@fortawesome/free-solid-svg-icons';
	}
}
