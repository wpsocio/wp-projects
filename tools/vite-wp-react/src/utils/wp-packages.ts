export const NON_WP_PACKAGES: Record<string, string> = {
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
	// 'react-refresh/runtime': 'ReactRefreshRuntime',
};

export const PACKAGE_HANDLES: Record<string, string> = {
	'lodash-es': 'lodash',
	'react-dom/client': 'react-dom',
	// 'react/jsx-runtime': 'react-jsx-runtime',
	// 'react-refresh/runtime': 'wp-react-refresh-runtime',
};

/**
 * WordPress packages that are bundled.
 *
 * This list comes from Gutenberg
 * @see https://github.com/WordPress/gutenberg/blob/trunk/packages/dependency-extraction-webpack-plugin/lib/util.js#L6
 */
export const BUNDLED_WP_PACKAGES = [
	'@wordpress/dataviews',
	'@wordpress/dataviews/wp',
	'@wordpress/icons',
	'@wordpress/interface',
	'@wordpress/sync',
	'@wordpress/undo-manager',
	'@wordpress/upload-media',
	'@wordpress/fields',
];
