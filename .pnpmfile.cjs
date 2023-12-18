function afterAllResolved(lockfile) {
	// Since we are not tracking the lockfile, we need to generate a hash of the lockfile
	// To use for cache busting
	const hashedContent = require('crypto')
		.createHash('sha1')
		.update(JSON.stringify(lockfile))
		.digest('hex');

	console.log('hashedContent', hashedContent);

	require('fs').writeFileSync(
		require('path').join(__dirname, 'pnpm-lock-hashed'),
		hashedContent,
	);

	return lockfile;
}

module.exports = {
	hooks: {
		afterAllResolved,
	},
};
