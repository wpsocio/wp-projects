import { tailwindPreset } from '@wpsocio/ui-components/tools/tailwind-preset';

const preset = tailwindPreset({
	scopeStylesInside: '#wptelegram-settings',
});

/** @type {import('tailwindcss').Config} */
const config = {
	presets: [preset],
	content: [
		...preset.content,
		'./js/**/*.tsx',
		'./node_modules/@wpsocio/shared-ui/{components,form,wptelegram}/**/*.tsx',
	],
};

export default config;
