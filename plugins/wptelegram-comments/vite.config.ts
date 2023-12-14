import { createViteConfig, defineConfig } from '@wpsocio/dev/vite';

export default defineConfig(
	createViteConfig({
		input: {
			settings: 'js/settings/index.ts',
		},
		outDir: 'src/assets/build',
	}),
);
