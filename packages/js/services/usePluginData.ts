import type { BaseDOMData } from './types';

export const usePluginData = <
	PluginData extends BaseDOMData,
	K extends keyof PluginData | undefined = undefined,
>(
	plugin: string,
	dataKey?: K,
): K extends keyof PluginData ? PluginData[K] : PluginData => {
	const pluginData = window[plugin];
	// @ts-ignore
	return dataKey ? pluginData?.[dataKey] : pluginData;
};
