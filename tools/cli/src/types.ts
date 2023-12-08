import type { Argv } from 'yargs';

export type InferBuilderOptions<TArgv extends Argv> = TArgv extends Argv<infer T> ? T : never;
