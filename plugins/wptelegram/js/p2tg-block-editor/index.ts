import { registerPlugin } from '@wordpress/plugins';

import { setLocaleData } from '@wpsocio/i18n';

import { SendToTelegram } from './SendToTelegram';
import { PLUGIN_NAME } from './constants';

const i18nData = window.wptelegram?.i18n;

setLocaleData(
	// @ts-expect-error
	i18nData,
	'wptelegram',
);

registerPlugin(PLUGIN_NAME, {
	render: SendToTelegram,
});
