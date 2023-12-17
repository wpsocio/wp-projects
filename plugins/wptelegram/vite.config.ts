import { createViteConfig, defineConfig } from '@wpsocio/dev/vite';

export default defineConfig(
	createViteConfig({
		input: {
			settings: 'js/settings/index.ts',
			blocks: 'js/p2tg-block-editor/index.ts',
			public: 'js/p2tg-classic-editor/index.ts',
		},
		outDir: 'src/assets/build',
	}),
);
