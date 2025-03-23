import type {
	BaseAssetsData,
	BaseDOMData,
	BasePluginData,
} from '@wpsocio/services/types.js';
import type { ProxyFields } from '@wpsocio/shared-ui/wptelegram/proxy/types.js';
import type { Rules } from '@wpsocio/shared-ui/wptelegram/rules/types.js';
import type { ChatIds } from '@wpsocio/shared-ui/wptelegram/types.js';
import type { OptionsType } from '@wpsocio/ui/wrappers/types';
import type { ParseMode } from '@wpsocio/utilities/types';
import type { DataShape } from './fields';

export type { DataShape };

export interface WPTelegramData
	extends BaseDOMData<AssetsData>,
		BasePluginData<DataShape, UiData> {}

export interface AssetsData extends BaseAssetsData {
	tgIconUrl: string;
	editProfileUrl: string;
	p2tgLogUrl?: string;
	botApiLogUrl?: string;
}

export interface TemplateMacro {
	label: string;
	macros: Array<string>;
	info?: string;
}

export interface UiData {
	debug_info?: string;
	post_types: OptionsType;
	rule_types: OptionsType;
	is_wp_cron_disabled?: boolean;
	macros: {
		post: TemplateMacro;
		terms: TemplateMacro;
		cf: TemplateMacro;
	};
	allChannels?: Array<string>;
}

export interface BasicFields {
	bot_token: string;
	bot_username?: string;
}

export interface CommonFields {
	active: boolean;
}

export interface PostToTelegramFields extends CommonFields {
	cats_as_tags?: boolean;
	channels?: ChatIds;
	delay?: number;
	disable_notification?: boolean;
	link_preview_disabled?: boolean;
	link_preview_url?: string;
	link_preview_above_text?: boolean;
	excerpt_length?: number;
	excerpt_preserve_eol?: boolean;
	excerpt_source?: 'post_content' | 'before_more' | 'post_excerpt';
	image_position?: 'before' | 'after';
	inline_button_text?: string;
	inline_button_url?: string;
	inline_url_button?: boolean;
	message_template?: string;
	parse_mode?: ParseMode;
	plugin_posts?: boolean;
	post_edit_switch?: boolean;
	post_types?: Array<string>;
	rules?: Rules;
	send_featured_image?: boolean;
	send_when?: Array<'new' | 'existing'>;
	single_message?: boolean;
}

export interface PrivateNotificationsFields extends CommonFields {
	watch_emails?: string;
	chat_ids?: ChatIds;
	user_notifications?: boolean;
	message_template?: string;
	parse_mode?: ParseMode;
}

export interface AdvancedFields {
	send_files_by_url?: boolean;
	clean_uninstall?: boolean;
	enable_logs?: Array<'bot_api' | 'p2tg'>;
}

export interface DataShape_Backup extends BasicFields {
	p2tg: PostToTelegramFields;
	notify: PrivateNotificationsFields;
	proxy: ProxyFields;
	advanced: AdvancedFields;
}

declare global {
	interface Window {
		wptelegram: WPTelegramData;
	}
}
