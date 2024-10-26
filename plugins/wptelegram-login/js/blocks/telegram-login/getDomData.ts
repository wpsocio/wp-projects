import { getPluginData } from '@wpsocio/services/get-plugin-data.js';
import type { WPTelegramLoginData } from './types';

export const getDomData = <
	K extends keyof WPTelegramLoginData | undefined = undefined,
>(
	key?: K,
): K extends keyof WPTelegramLoginData
	? WPTelegramLoginData[K]
	: WPTelegramLoginData => {
	return getPluginData('wptelegram_login', key);
};
