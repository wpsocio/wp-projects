import * as wpI18n from '@wordpress/i18n';

let TEXT_DOMAIN = '';

const createI18n = wpI18n.createI18n;

// create i18n instance with translation data and text domain
const i18n = createI18n?.() || wpI18n;

export const setLocaleData = (data: wpI18n.LocaleData, domain: string) => {
	TEXT_DOMAIN = domain;
	i18n.setLocaleData(data, domain);
};

export const __ = <Text extends string>(
	text: Text,
): wpI18n.TranslatableText<Text> => {
	return i18n.__(text, TEXT_DOMAIN);
};

export const _n = <Single extends string, Plural extends string>(
	single: Single,
	plural: Plural,
	number: number,
): wpI18n.TranslatableText<Single | Plural> => {
	return i18n._n(single, plural, number, TEXT_DOMAIN);
};

export const _nx = <Single extends string, Plural extends string>(
	single: Single,
	plural: Plural,
	number: number,
	context: string,
): wpI18n.TranslatableText<Single | Plural> => {
	return i18n._nx(single, plural, number, context, TEXT_DOMAIN);
};

export const _x = <Single extends string>(
	single: Single,
	context: string,
): wpI18n.TranslatableText<Single> => {
	return i18n._x(single, context, TEXT_DOMAIN);
};

export const isRTL = (): boolean => document.documentElement.dir === 'rtl';

export { sprintf } from '@wordpress/i18n';
