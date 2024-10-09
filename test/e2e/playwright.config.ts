import os from 'node:os';
import { fileURLToPath } from 'node:url';
import { defineConfig, devices } from '@playwright/test';
// @ts-expect-error
import baseConfig from '@wordpress/scripts/config/playwright.config.js';

const config = defineConfig({
	...baseConfig,
	workers: 1,
	globalSetup: fileURLToPath(
		new URL('./config/global-setup.ts', import.meta.url).href,
	),
	projects: [
		{
			name: 'chromium',
			use: { ...devices['Desktop Chrome'] },
			grepInvert: /-chromium/,
		},
		{
			name: 'webkit',
			use: {
				...devices['Desktop Safari'],
				headless: os.type() !== 'Linux',
			},
			grep: /@webkit/,
			grepInvert: /-webkit/,
		},
		{
			name: 'firefox',
			use: { ...devices['Desktop Firefox'] },
			grep: /@firefox/,
			grepInvert: /-firefox/,
		},
	],
});

export default config;
