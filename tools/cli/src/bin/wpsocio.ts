#!/usr/bin/env ts-node
import '../env.js'; // Load environment variables before anything else.
import process from 'node:process';
import { ROOT_DIR } from '../utils/monorepo.js';
import { cli } from '../cli-builder.js';

// Fix the CLI location to the root of the monorepo.
process.chdir(ROOT_DIR);

cli();
