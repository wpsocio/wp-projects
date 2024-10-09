import type { BlockAlignmentToolbar } from '@wordpress/block-editor';
import type {
	BaseAssetsData,
	BaseDOMData,
	BasePluginData,
} from '@wpsocio/services/types';

export type TAlignment = NonNullable<
	BlockAlignmentToolbar.Props['controls']
>[number];

export interface WPTelegramWidgetData
	extends BaseDOMData<AssetsData>,
		BasePluginData<unknown, UiData> {}

export interface AssetsData extends BaseAssetsData {
	message_view_url: string;
}

export interface UiData {
	join_link_url?: string;
	join_link_text?: string;
}

export type AjaxWidgetAtts = {
	widget_height: string;
	username: string;
	widget_width: string;
};

export interface LegacyWidgetAtts {
	widget_width: string;
	author_photo: 'auto' | 'always_show' | 'always_hide';
	num_messages: number;
}

export type SinglePostAtts = {
	alignment: TAlignment;
	iframe_src: string;
	url: string;
	userpic: boolean;
};

export type JoinChannelAtts = {
	alignment: TAlignment;
	text: string;
	link: string;
};

declare global {
	interface Window {
		wptelegram_widget: WPTelegramWidgetData;
	}
}
