import { createViteConfig, defineConfig } from '@wpsocio/dev/vite';
import { dev } from './build.config.js';

export default defineConfig(createViteConfig(dev));
