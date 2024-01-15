function fixPeerDeps(pkg) {
	const reactOldPkgs = new Set([
		'react-autosize-textarea',
		'reakit',
		'reakit-system',
		'reakit-utils',
		'reakit-warning',
	]);
	if (reactOldPkgs.has(pkg.name)) {
		for (const p of ['react', 'react-dom']) {
			if (!pkg.peerDependencies?.[p]) {
				continue;
			}

			if (
				pkg.peerDependencies[p].match(/(?:^|\|\|\s*)(?:\^16|16\.x)/) &&
				!pkg.peerDependencies[p].match(/(?:^|\|\|\s*)(?:\^17|17\.x)/)
			) {
				pkg.peerDependencies[p] += ' || ^17';
			}
			if (
				pkg.peerDependencies[p].match(/(?:^|\|\|\s*)(?:\^17|17\.x)/) &&
				!pkg.peerDependencies[p].match(/(?:^|\|\|\s*)(?:\^18|18\.x)/)
			) {
				pkg.peerDependencies[p] += ' || ^18';
			}
		}
	}

	return pkg;
}

function readPackage(pkg, context) {
	if (pkg.name) {
		return fixPeerDeps(pkg, context);
	}
	return pkg;
}

function afterAllResolved(lockfile) {
	// Since we are not tracking the lockfile, we need to generate a hash of the lockfile
	// To use for cache busting
	const hashedContent = require('crypto')
		.createHash('sha1')
		.update(JSON.stringify(lockfile))
		.digest('hex');

	console.log('hashedContent', hashedContent);

	require('fs').writeFileSync(
		require('path').join(__dirname, 'pnpm-hashed.lock'),
		hashedContent,
	);

	return lockfile;
}

module.exports = {
	hooks: {
		readPackage,
		afterAllResolved,
	},
};
