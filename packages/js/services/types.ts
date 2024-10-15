import type { AnyObject } from '@wpsocio/utilities/types';

export interface ApiData {
	admin_url?: string;
	ajax_url?: string;
	home_url?: string;
	rest_namespace?: string;
	use?: 'SERVER' | 'BROWSER';
	wp_rest_url?: string;
}

export interface BaseAssetsData {
	logoUrl?: string;
	jsDistUrl?: string;
}

export interface I18nInfo {
	domain: string;
	lang: string;
	plural_forms?: string;
}

export type I18nData = {
	'': I18nInfo;
	[key: string]: unknown;
};

export interface PluginInfo {
	name: string;
	title: string;
	description?: string;
	version: string;
}

export interface BaseDOMData<A extends BaseAssetsData | undefined = AnyObject> {
	api: ApiData;
	assets: A;
	i18n: I18nData;
	pluginInfo: PluginInfo;
	cache?: AnyObject;
}

export interface BasePluginData<S, U = AnyObject> {
	savedSettings: S;
	uiData: U;
}

declare global {
	interface Window {
		// its value must be set by every domain on init
		'X-WP-Nonce': string;
		[key: string]: BaseDOMData;
	}
}
