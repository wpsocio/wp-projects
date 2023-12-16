import type { OptionsType } from '@wpsocio/adapters';
import type {
	BaseAssetsData,
	BaseDOMData,
	BasePluginData,
} from '@wpsocio/services';
import { DataShape } from './fields';

export type { DataShape };

export interface WPTelegramWidgetData
	extends BaseDOMData<AssetsData>,
		BasePluginData<DataShape, UiData> {}

export interface AssetsData extends BaseAssetsData {
	tgIconUrl: string;
	pullUpdatesUrl: string;
}

export interface UiData {
	post_types: OptionsType;
}

export interface AjaxWidgetFields {
	height?: string;
	username?: string;
	width?: string;
}

export interface LegacyWidgetFields extends Partial<AjaxWidgetFields> {
	author_photo?: 'auto' | 'always_show' | 'always_hide';
	bot_token?: string;
	num_messages?: number;
}

export interface JoinLinkFields {
	bgcolor?: string;
	position?: 'before_content' | 'after_content';
	post_types?: Array<string>;
	priority?: string;
	text?: string;
	text_color?: string;
	url?: string;
}

export interface AdvancedFields {
	telegram_blocked?: boolean;
	google_script_url?: string;
}

export interface DataShape_Backup {
	ajax_widget: AjaxWidgetFields;
	join_link: JoinLinkFields;
	legacy_widget: LegacyWidgetFields;
	advanced: AdvancedFields;
}
