function fixPeerDeps(pkg) {
	// @wordpress/* and its dependencies are ages behind
	const reactOldPkgs = new Set([
		'react-autosize-textarea',
		'reakit',
		'reakit-system',
		'reakit-utils',
		'reakit-warning',
		'@wordpress/data',
		'@wordpress/compose',
		'@wordpress/blocks',
		'@wordpress/core-data',
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

module.exports = {
	hooks: {
		readPackage,
	},
};
