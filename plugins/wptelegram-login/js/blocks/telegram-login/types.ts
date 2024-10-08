import type {
	BaseAssetsData,
	BaseDOMData,
	BasePluginData,
} from '@wpsocio/services/types';

type SimpleOptionsType = Array<{
	value: string;
	label: string;
}>;

export interface WPTelegramLoginData
	extends BaseDOMData<AssetsData>,
		BasePluginData<unknown, UiData> {}

export interface AssetsData extends BaseAssetsData {
	loginImageUrl: string;
	loginAvatarUrl: string;
}

export interface UiData {
	lang: SimpleOptionsType;
	show_if_user_is: SimpleOptionsType;
}

export type TelegramLoginAtts = {
	button_style?: string;
	show_user_photo?: boolean;
	corner_radius?: string;
	lang?: string;
	show_if_user_is?: string;
};
