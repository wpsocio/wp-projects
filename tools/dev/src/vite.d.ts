import { V4wpOptions } from '@kucrut/vite-for-wp';
import { UserConfig } from 'vite';

declare function createViteConfig(options: V4wpOptions): UserConfig;
declare function defineConfig(config: UserConfig): UserConfig;
