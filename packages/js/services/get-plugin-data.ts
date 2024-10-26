import type { BaseDOMData } from './types';

export const getPluginData = <
	PluginData extends BaseDOMData,
	K extends keyof PluginData | undefined = undefined,
>(
	plugin: string,
	dataKey?: K,
): K extends keyof PluginData ? PluginData[K] : PluginData => {
	const pluginData = window[plugin];
	return dataKey
		? // @ts-expect-error
			pluginData?.[dataKey]
		: pluginData;
};
