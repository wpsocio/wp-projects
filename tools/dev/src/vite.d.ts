import { UserConfig, UserConfigFn } from 'vite';
import { CreateViteConfigOptions } from './types.ts';

declare function createViteConfig(
	options: CreateViteConfigOptions,
): UserConfigExport;
declare function defineConfig(config: UserConfigExport): UserConfigExport;
