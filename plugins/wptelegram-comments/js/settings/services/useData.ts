import { usePluginData } from '@wpsocio/services/use-plugin-data.js';
import type { WPTelegramCommentsData } from './types';

export const useData = <
	K extends keyof WPTelegramCommentsData | undefined = undefined,
>(
	key?: K,
): K extends keyof WPTelegramCommentsData
	? WPTelegramCommentsData[K]
	: WPTelegramCommentsData => {
	return usePluginData('wptelegram_comments', key);
};
