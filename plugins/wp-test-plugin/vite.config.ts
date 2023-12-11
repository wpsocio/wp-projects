import { createViteConfig, defineConfig } from '@wpsocio/dev/vite';

export default defineConfig(
	createViteConfig({
		input: {
			main: 'src/js/main/index.tsx',
			login: 'src/js/login/index.tsx',
		},
		outDir: 'src/assets/build',
	}),
);
