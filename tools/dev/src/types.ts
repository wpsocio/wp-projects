import { Plugin as EsBuildPlugin } from 'esbuild';
import { InputOption } from 'rollup';

export const IMPORTS_TO_IGNORE =
	/\.(css|less|sass|scss|styl|stylus|pcss|postcss|sss)(?:$|\?)/;

export type ExtractDepsOptions = {
	input?: InputOption;
	externalDeps: Array<string>;
	normalizePath?: (path: string) => string;
	outDir: string;
	fileName?: string;
	isProduction?: boolean;
	plugins?: Array<EsBuildPlugin>;
};
