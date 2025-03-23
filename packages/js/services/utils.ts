import $ from 'jquery';

import { setLocaleData } from '@wpsocio/i18n';

export const cleanup = (
	removeSiblingsOf = '',
	{ disableFormCSS = true, disableCommonCSS = false } = {},
) => {
	const id = removeSiblingsOf?.replace(/^#?/, '#');
	$(() => {
		if (id && $(id).length) {
			$(id).siblings().remove();
		}
		if (disableFormCSS) {
			$('#forms-css').prop('disabled', true);
		}
		if (disableCommonCSS) {
			$('#common-css').prop('disabled', true);
		}
	});
};

export const setI18nData = (plugin: string, domain: string) => {
	const i18nData = window[plugin].i18n;
	setLocaleData(i18nData, domain);
};
