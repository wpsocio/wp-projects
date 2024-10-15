import { usePluginData } from '@wpsocio/services/use-plugin-data.js';
import type { WPTelegramWidgetData } from './types';

export const useData = <
	K extends keyof WPTelegramWidgetData | undefined = undefined,
>(
	key?: K,
): K extends keyof WPTelegramWidgetData
	? WPTelegramWidgetData[K]
	: WPTelegramWidgetData => {
	return usePluginData('wptelegram_widget', key);
};
