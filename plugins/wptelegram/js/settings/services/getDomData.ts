import { getPluginData } from '@wpsocio/services/get-plugin-data.js';
import type { WPTelegramData } from './types';

export const getDomData = <
	K extends keyof WPTelegramData | undefined = undefined,
>(
	key?: K,
): K extends keyof WPTelegramData ? WPTelegramData[K] : WPTelegramData => {
	return getPluginData('wptelegram', key);
};
