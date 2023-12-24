import { V4wpOptions } from '@kucrut/vite-for-wp';
import { Plugin as EsBuildPlugin } from 'esbuild';
import { InputOption } from 'rollup';
import { BuildOptions } from 'vite';

export const IMPORTS_TO_IGNORE =
	/\.(css|less|sass|scss|styl|stylus|pcss|postcss|sss)(?:$|\?)/;

export type ExtractDepsOptions = {
	absWorkingDir: string;
	input?: InputOption;
	externalDeps: Array<string>;
	normalizePath?: (path: string) => string;
	outDir: string;
	fileName?: string;
	isProduction?: boolean;
	plugins?: Array<EsBuildPlugin>;
};

type MakePotOptions = {
	output?: string;
	headers?: Record<string, string>;
	functions?: Record<string, Array<string | null>>;
};

export type CreateViteConfigOptions = {
	input: NonNullable<V4wpOptions['input']>;
	outDir: V4wpOptions['outDir'];
	buildOptions?: BuildOptions;
	makePot?: MakePotOptions | null;
};
