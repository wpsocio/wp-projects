import type { UserConfig } from 'vite';
import viteWpReact, { type ViteWpReactOptions } from './index.js';
import type { DevServerOptions } from './plugins/dev-server.js';
import type { ReactMakePotOptions } from './plugins/react-make-pot.js';

export type CreateViteConfigOptions = ViteWpReactOptions & {
	makePot?: ReactMakePotOptions;
	corsOrigin?: DevServerOptions['corsOrigin'];
};

/**
 * Create Vite config.
 */
export function createViteConfig({
	outDir,
	input,
	makePot,
	corsOrigin,
}: CreateViteConfigOptions): UserConfig {
	return {
		// Ensure that the asset paths are relative.
		base: './',
		plugins: [
			viteWpReact(
				{ outDir, input, assetsDir: 'dist' },
				{
					extractWpDependencies: true,
					externalizeWpPackages: true,
					enableReact: true,
					makePot,
					corsOrigin,
				},
			),
		],
	};
}
