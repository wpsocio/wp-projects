import type { SimpleOptionsType } from '@wpsocio/adapters';
import type {
	BaseAssetsData,
	BaseDOMData,
	BasePluginData,
} from '@wpsocio/services';
import type { DataShape } from './fields';

export type { DataShape };

export interface WPTelegramCommentsData
	extends BaseDOMData<AssetsData>,
		BasePluginData<DataShape, UiData> {}

export interface AssetsData extends BaseAssetsData {
	tgIconUrl: string;
}

export interface UiData {
	post_types: SimpleOptionsType;
}

export interface DataShape_Backup {
	attributes?: string;
	code: string;
	exclude?: string;
	post_types: Array<string>;
}
