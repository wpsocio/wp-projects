import { getPluginData } from '@wpsocio/services/get-plugin-data.js';
import type { WPTelegramWidgetData } from './types';

export const getDomData = <
	K extends keyof WPTelegramWidgetData | undefined = undefined,
>(
	key?: K,
): K extends keyof WPTelegramWidgetData
	? WPTelegramWidgetData[K]
	: WPTelegramWidgetData => {
	return getPluginData('wptelegram_widget', key);
};
