export const NON_WP_PACKAGES: Record<string, string> = {
	'@babel/runtime/regenerator': 'regeneratorRuntime',
	jquery: 'jQuery',
	tinymce: 'tinymce',
	moment: 'moment',
	react: 'React',
	'react-dom': 'ReactDOM',
	'react-dom/client': 'ReactDOM',
	backbone: 'Backbone',
	lodash: 'lodash',
	'lodash-es': 'lodash',
	// 'react/jsx-runtime': 'ReactJSXRuntime',
	// 'react/jsx-dev-runtime': 'ReactJSXRuntime',
	// 'react-refresh/runtime': 'ReactRefreshRuntime',
};

export const PACKAGE_HANDLES: Record<string, string> = {
	'@babel/runtime/regenerator': 'regenerator-runtime',
	'lodash-es': 'lodash',
	'react-dom/client': 'react-dom',
	// 'react/jsx-runtime': 'react-jsx-runtime',
	// 'react-refresh/runtime': 'wp-react-refresh-runtime',
};

/**
 * WordPress packages that are bundled.
 *
 * This list comes from Gutenberg
 * @see https://github.com/WordPress/gutenberg/blob/trunk/packages/dependency-extraction-webpack-plugin/lib/util.js
 */
export const BUNDLED_WP_PACKAGES = [
	'@wordpress/admin-ui',
	'@wordpress/dataviews',
	'@wordpress/dataviews/wp',
	'@wordpress/icons',
	'@wordpress/interface',
	'@wordpress/sync',
	'@wordpress/undo-manager',
	'@wordpress/upload-media',
	'@wordpress/fields',
	'@wordpress/views',
	'@wordpress/ui',
];

/**
 * Converts kebab-case string to camelCase.
 */
export function dashToCamelCase(input: string): string {
	return input.replace(/-([a-z])/g, (_, letter) => letter.toUpperCase());
}

/**
 * Maps a package name to its WordPress script handle.
 */
export function getWpScriptHandle(name: string): string {
	if (name in PACKAGE_HANDLES) {
		return PACKAGE_HANDLES[name];
	}

	return name.replace(/^@wordpress\//, 'wp-');
}
