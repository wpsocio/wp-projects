import '../../env.js'; // Load environment variables before anything else.

import { Hook } from '@oclif/core';
import { ROOT_DIR } from '../../utils/monorepo.js';

const hook: Hook<'init'> = async () => {
	// Fix the CLI location to the root of the monorepo.
	process.chdir(ROOT_DIR);
};

export default hook;
