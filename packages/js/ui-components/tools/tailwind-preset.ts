import path from 'node:path';
import formsPlugin from '@tailwindcss/forms';
import typographyPlugin from '@tailwindcss/typography';
import type { Config } from 'tailwindcss';
import animatePlugin from 'tailwindcss-animate';
import {
	// @ts-expect-error isolateInsideOfContainer is not exported in types
	isolateInsideOfContainer,
	scopedPreflightStyles,
} from 'tailwindcss-scoped-preflight';
import { shadcnUiPlugin } from './shadcn-ui-plugin.js';

export type TailwindPresetOptions = {
	scopeStylesInside?: string;
};

export function tailwindPreset({
	scopeStylesInside,
}: TailwindPresetOptions): Config {
	return {
		darkMode: ['class'],
		content: ['ui', 'wrappers', 'icons'].map(
			(folder) => `${path.dirname(__dirname)}/${folder}/**/*.{js,jsx,ts,tsx}`,
		),
		plugins: [
			shadcnUiPlugin,
			animatePlugin,
			formsPlugin,
			typographyPlugin,
			scopeStylesInside
				? scopedPreflightStyles({
						isolationStrategy: isolateInsideOfContainer(scopeStylesInside),
					})
				: undefined,
		],
		important: scopeStylesInside || undefined,
	};
}
