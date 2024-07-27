import type { OptionsType } from '@wpsocio/adapters';
import type {
	BaseAssetsData,
	BaseDOMData,
	BasePluginData,
} from '@wpsocio/services';
import type { DataShape } from './fields';

export type { DataShape };

export interface WPTelegramLoginData
	extends BaseDOMData<AssetsData>,
		BasePluginData<DataShape, UiData> {
	web_app_data?: {
		is_user_logged_in: boolean;
		confirm_login: boolean;
		login_auth_url: string;
		i18n: Record<string, unknown>;
	};
}

export interface AssetsData extends BaseAssetsData {
	tgIconUrl: string;
}

export interface UiData {
	show_if_user_is: OptionsType;
	lang: OptionsType;
	user_role: OptionsType;
	wptelegram_active?: boolean;
}

export interface DataShape_Backup {
	avatar_meta_key: string;
	bot_token: string;
	bot_username: string;
	button_style?: 'large' | 'medium' | 'small';
	corner_radius?: string;
	custom_error_message?: string;
	disable_signup?: boolean;
	hide_on_default?: boolean;
	random_email?: boolean;
	redirect_to?: 'default' | 'homepage' | 'current_page' | 'custom_url';
	redirect_url?: string;
	lang?: string;
	show_if_user_is?: string;
	show_message_on_error?: boolean;
	show_user_photo?: boolean;
	user_role?: string;
}

declare global {
	interface Window {
		wptelegram_login: WPTelegramLoginData;
	}
}
