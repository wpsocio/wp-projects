import { tailwindPreset } from '@wpsocio/ui-components/tools/tailwind-preset';

const preset = tailwindPreset({
	scopeStylesInside: '#wptelegram-login-settings',
});

/** @type {import('tailwindcss').Config} */
const config = {
	presets: [preset],
	content: [
		...preset.content,
		'./js/**/*.tsx',
		'./node_modules/@wpsocio/shared-ui/{components,form}/**/*.tsx',
	],
};

export default config;
