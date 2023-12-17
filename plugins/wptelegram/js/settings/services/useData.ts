import { usePluginData } from '@wpsocio/services';
import type { WPTelegramData } from './types';

export const useData = <K extends keyof WPTelegramData | undefined = undefined>(
	key?: K,
): K extends keyof WPTelegramData ? WPTelegramData[K] : WPTelegramData => {
	return usePluginData('wptelegram', key);
};
