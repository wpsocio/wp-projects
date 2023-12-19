import { V4wpOptions } from '@kucrut/vite-for-wp';
import { BuildOptions, UserConfig } from 'vite';

declare function createViteConfig(
	options: V4wpOptions,
	buildOptions?: BuildOptions,
): UserConfig;
declare function defineConfig(config: UserConfig): UserConfig;
