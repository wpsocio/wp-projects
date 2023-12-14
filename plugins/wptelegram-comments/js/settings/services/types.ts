import type { OptionsType } from '@wpsocio/adapters';
import type {
	BaseAssetsData,
	BaseDOMData,
	BasePluginData,
} from '@wpsocio/services';

export interface WPTelegramCommentsData
	extends BaseDOMData<AssetsData>,
		BasePluginData<DataShape, UiData> {}

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
