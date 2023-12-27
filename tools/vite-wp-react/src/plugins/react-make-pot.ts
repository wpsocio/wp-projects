import viteReact from '@vitejs/plugin-react';
import { PluginOption } from 'vite';

export type ReactMakePotOptions = {
	output?: string;
	headers?: Record<string, string>;
	functions?: Record<string, Array<string | null>>;
};

export function getMakePotReactConfig(options: ReactMakePotOptions) {
	return {
		babel: {
			plugins: [['@wordpress/babel-plugin-makepot', options]],
		},
	};
}

/**
 * Adds react plugin to extract translation strings to a .pot file.
 */
export const reactMakePot = (
	options: ReactMakePotOptions = {},
): PluginOption => {
	const plugins = viteReact(getMakePotReactConfig(options));

	for (const plugin of plugins) {
		if (
			plugin &&
			typeof plugin === 'object' &&
			// Not a promise
			!('then' in plugin) &&
			// Not an array
			!Array.isArray(plugin) &&
			plugin.name === 'vite:react-babel'
		) {
			return {
				...plugin,
				name: 'vwpr:react-make-pot',
				apply: 'build',
			};
		}
	}

	return null;
};
