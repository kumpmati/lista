import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';
import { functionsMixins } from 'vite-plugin-functions-mixins';
import wasm from 'vite-plugin-wasm';
import topLevelAwait from 'vite-plugin-top-level-await';

export default defineConfig({
	plugins: [sveltekit(), functionsMixins({ deps: ['m3-svelte'] }), wasm(), topLevelAwait()]
});
