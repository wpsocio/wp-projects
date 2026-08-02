import tailwindcss from '@tailwindcss/postcss';

/**
 * Tailwind emits plugin base styles (our scoped preflight) into `@layer base`.
 * WordPress admin CSS is unlayered and therefore beats every cascade layer,
 * so the preflight is hoisted out of the layer and to the top of the file,
 * which is where it sat before the Tailwind v4 migration.
 */
const unwrapBaseLayer = {
	postcssPlugin: 'wpsocio-unwrap-base-layer',
	OnceExit(root) {
		root.walkAtRules('layer', (rule) => {
			if (rule.params === 'base') {
				const nodes = rule.nodes;
				rule.remove();
				root.prepend(nodes);
			}
		});
	},
};

/** @type {import('postcss-load-config').Config} */
const config = {
	plugins: [tailwindcss(), unwrapBaseLayer],
};

export default config;
