function fixPeerDeps(pkg) {
	/*
	 * react-autosize-textarea is unmaintained (react peer capped at ^16) but
	 * still pulled in by @wordpress/* packages. Widen to the react we ship.
	 */
	if (pkg.name === 'react-autosize-textarea') {
		for (const p of ['react', 'react-dom']) {
			if (pkg.peerDependencies?.[p]) {
				pkg.peerDependencies[p] += ' || ^17 || ^18';
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
