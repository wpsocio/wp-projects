import { OptionsType } from '@wpsocio/components/select';
import type {
	BaseAssetsData,
	BaseDOMData,
	BasePluginData,
} from '@wpsocio/helpers/types';

export interface WPTelegramCommentsData
	extends BaseDOMData<AssetsData>,
		BasePluginData<DataShape, UiData> {}

export interface AssetsData extends BaseAssetsData {
	tgIconUrl: string;
}

export interface AssetsData extends BaseAssetsData {
	tgIconUrl: string;
}

export interface UiData {
	post_types: OptionsType;
}

export interface DataShape {
	attributes?: string;
	code: string;
	exclude?: string;
	post_types: Array<string>;
}

declare global {
	interface Window {
		wptelegram_comments: WPTelegramCommentsData;
	}
}
