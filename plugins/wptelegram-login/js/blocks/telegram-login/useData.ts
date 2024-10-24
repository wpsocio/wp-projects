import { usePluginData } from '@wpsocio/services/use-plugin-data';
import type { WPTelegramLoginData } from './types';

export const useData = <
	K extends keyof WPTelegramLoginData | undefined = undefined,
>(
	key?: K,
): K extends keyof WPTelegramLoginData
	? WPTelegramLoginData[K]
	: WPTelegramLoginData => {
	return usePluginData('wptelegram_login', key);
};
