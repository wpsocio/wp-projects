// @ts-check

/**
 * Exposes the PHP/WP versions from the shared bundle config as workflow outputs,
 * so that the CI matrices don't have to duplicate them.
 */

import { appendFileSync } from 'node:fs';
import { phpVersions, wpVersions } from '../../config/wpdev.base.project.js';

const outputs = {
	'php-all': JSON.stringify(phpVersions),
	'php-min': phpVersions[0],
	'php-max': phpVersions[phpVersions.length - 1],
	'wp-all': JSON.stringify(wpVersions),
};

const { GITHUB_OUTPUT } = process.env;

if (!GITHUB_OUTPUT) {
	throw new Error('GITHUB_OUTPUT is not set.');
}

// Single line values, so no need for the heredoc syntax
const contents = Object.entries(outputs)
	.map(([key, value]) => `${key}=${value}`)
	.join('\n');

console.log(contents);

appendFileSync(GITHUB_OUTPUT, `${contents}\n`);
