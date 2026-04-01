import type { User, Session } from 'better-auth/minimal';
import 'vite-plugin-pwa/info';
import 'vite-plugin-pwa/client';
import 'vite-plugin-pwa/pwa-assets';

// See https://svelte.dev/docs/kit/types#app.d.ts
// for information about these interfaces
declare global {
	namespace App {
		interface Platform {
			env: Env;
			ctx: ExecutionContext;
			caches: CacheStorage;
			cf?: IncomingRequestCfProperties;
		}

		interface Locals {
			user?: User;
			session?: Session;
		}

		// interface Error {}
		// interface PageData {}
		// interface PageState {}
	}
}

export {};
