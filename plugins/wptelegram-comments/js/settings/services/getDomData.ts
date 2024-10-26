import { getPluginData } from '@wpsocio/services/get-plugin-data.js';
import type { WPTelegramCommentsData } from './types';

export const getDomData = <
	K extends keyof WPTelegramCommentsData | undefined = undefined,
>(
	key?: K,
): K extends keyof WPTelegramCommentsData
	? WPTelegramCommentsData[K]
	: WPTelegramCommentsData => {
	return getPluginData('wptelegram_comments', key);
};
