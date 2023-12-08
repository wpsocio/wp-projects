import { Plugin as EsBuildPlugin } from 'esbuild';
import { InputOption, PluginContext } from 'rollup';
import { Plugin as VitePlugin } from 'vite';
export declare const IMPORTS_TO_IGNORE: RegExp;
export type ExtractDepsOptions = {
    input?: InputOption;
    externalDeps: Array<string>;
    normalizePath?: (path: string) => string;
    outDir: string;
    fileName?: string;
    isProduction?: boolean;
    plugins?: Array<EsBuildPlugin>;
};
/**
 * Extract dependencies
 */
export declare function extractExternalDeps(this: PluginContext, { externalDeps, fileName, input, isProduction, normalizePath, outDir, plugins, }: ExtractDepsOptions): Promise<void>;
export declare const extractExternalDepsPlugin: () => VitePlugin;
//# sourceMappingURL=extract-external-deps-plugin.d.ts.map