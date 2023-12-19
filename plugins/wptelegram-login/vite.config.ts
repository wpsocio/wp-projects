import { createViteConfig, defineConfig } from '@wpsocio/dev/vite';
import config from './build-config.json';

export default defineConfig(createViteConfig(config));
