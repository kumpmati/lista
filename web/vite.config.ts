import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';
import { functionsMixins } from 'vite-plugin-functions-mixins';
import { SvelteKitPWA } from '@vite-pwa/sveltekit';
import wasm from 'vite-plugin-wasm';
import topLevelAwait from 'vite-plugin-top-level-await';

export default defineConfig({
	plugins: [
		sveltekit(),
		SvelteKitPWA({
			registerType: 'autoUpdate',
			devOptions: {
				enabled: true,
				type: 'module'
			},
			manifest: {
				name: 'Lista',
				short_name: 'Lista',
				start_url: '/',
				scope: '/',
				description: 'A simple checklist application with collaborative editing',
				theme_color: undefined, // defined in app.html instead
				background_color: '#000',
				display: 'standalone',
				icons: [
					{
						src: '/favicon-512x.png',
						sizes: '512x512',
						type: 'image/png'
					},
					{
						src: '/favicon-192x.png',
						sizes: '192x192',
						type: 'image/png'
					},
					{
						src: '/favicon-128x.png',
						sizes: '128x128',
						type: 'image/png'
					}
				]
			}
		}),
		functionsMixins({ deps: ['m3-svelte'] }),
		wasm(),
		topLevelAwait()
	]
});
