#!/usr/bin/env ts-node

import '../env.js'; // Load environment variables before anything else.

import process from 'node:process';
import { cli } from '../cli-builder.js';
import { ROOT_DIR } from '../utils/monorepo.js';

// Fix the CLI location to the root of the monorepo.
process.chdir(ROOT_DIR);

cli();
