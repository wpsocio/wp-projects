import { createViteConfig } from '@wpsocio/vite-wp-react/config';
import { defineConfig } from 'vite';

export default defineConfig(
	createViteConfig({
		input: {
			'iframed-wp-admin': 'js/iframed-wp-admin/index.tsx',
		},
		assetsDir: 'assets',
		outDir: 'dist',
		corsOrigin: true,
	}),
);
