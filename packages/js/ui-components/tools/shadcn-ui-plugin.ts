import fs from 'node:fs';
import path from 'node:path';
import postcss from 'postcss';
import postcssJs from 'postcss-js';
import plugin from 'tailwindcss/plugin.js';
import tailwindConfig from './tailwind.config.js';

export const shadcnUiPlugin = plugin(
	({ addBase }) => {
		try {
			const shadcnCssFile = path.resolve(__dirname + '/../styles/global.css');

			const shadcnCss = fs.readFileSync(shadcnCssFile, 'utf8');

			const cssRoot = postcss.parse(shadcnCss);

			const { '@layer base': base } = postcssJs.objectify(cssRoot);

			addBase(base);
		} catch (error) {
			throw new Error('Failed to parse CSS file.', { cause: error });
		}
	},
	{
		theme: tailwindConfig.theme,
	},
);
