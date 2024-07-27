import type { UserConfig } from 'vite';
import viteWpReact, { type ViteWpReactOptions } from './index.js';
import type { ReactMakePotOptions } from './plugins/react-make-pot.js';

export type CreateViteConfigOptions = ViteWpReactOptions & {
	makePot?: ReactMakePotOptions;
};

/**
 * Create Vite config.
 */
export function createViteConfig({
	outDir,
	input,
	makePot,
}: CreateViteConfigOptions): UserConfig {
	return {
		plugins: [
			viteWpReact(
				{ outDir, input, assetsDir: 'dist' },
				{
					extractWpDependencies: true,
					externalizeWpPackages: true,
					enableReact: true,
					makePot,
				},
			),
		],
	};
}
