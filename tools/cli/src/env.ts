import dotenv from 'dotenv';
import { ROOT_DIR } from './utils/monorepo.js';

dotenv.config({
	path: ROOT_DIR + '/.env',
});
