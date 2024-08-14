/** @type {import('tailwindcss').Config} */
const config = {
	content: ['./ui/**/*.tsx', './wrappers/**/*.tsx', './icons/**/*.tsx', './styles/*.css'].map(
		(path) => `./packages/components/${path}`
	),
};

export default config;
