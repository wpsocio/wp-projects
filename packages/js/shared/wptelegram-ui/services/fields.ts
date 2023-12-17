import * as yup from 'yup';

import { __ } from '@wpsocio/i18n';
import {
	ParseMode,
	fieldLabelGetter,
	getFormErrorMessage,
} from '@wpsocio/utilities';

import type { ProxyType } from './types';

export const fieldLabels = {
	active: () => __('Active'),
	bot: () => __('Bot'),
	bot_token: () => __('Bot Token'),
	bot_username: () => __('Bot Username'),
	cats_as_tags: () => __('Categories as hashtags'),
	cf_worker_url: () => __('Cloudflare worker URL'),
	channels: () => __('Channel(s)'),
	chat_id: () => __('Chat ID'),
	chat_ids: () => __('Send it to'),
	clean_uninstall: () => __('Remove settings on uninstall'),
	debug_info: () => __('Debug Info'),
	delay: () => __('Delay in Posting'),
	disable_notification: () => __('Disable Notifications'),
	disable_web_page_preview: () => __('Disable Web Page Preview'),
	enable_logs: () => __('Enable logs for'),
	excerpt_length: () => __('Excerpt Length'),
	excerpt_preserve_eol: () => __('Excerpt Newlines'),
	excerpt_source: () => __('Excerpt Source'),
	google_script_url: () => __('Google Script URL'),
	image_position: () => __('Image Position'),
	message_template: () => __('Message Template'),
	parse_mode: () => __('Formatting'),
	plugin_posts: () => __('Plugin generated posts'),
	post_edit_switch: () => __('Post edit switch'),
	post_types: () => __('Post type'),
	protect_content: () => __('Protect content'),
	proxy_host: () => __('Proxy Host'),
	proxy_method: () => __('Proxy Method'),
	proxy_password: () => __('Password'),
	proxy_port: () => __('Proxy Port'),
	proxy_type: () => __('Proxy Type'),
	proxy_username: () => __('Username'),
	send_featured_image: () => __('Featured Image'),
	send_files_by_url: () => __('Send files by URL'),
	single_message: () => __('Single message'),
	user_notifications: () => __('Notifications to Users'),
};

export const getFieldLabel = fieldLabelGetter(fieldLabels);

export const getErrorMessage = getFormErrorMessage(fieldLabels);

export const proxySchema = yup.object({
	active: yup.boolean(),
	proxy_method: yup
		.string()
		.nullable()
		.oneOf(['cf_worker', 'google_script', 'php_proxy'], () =>
			getErrorMessage('proxy_method', 'invalid'),
		),
	cf_worker_url: yup
		.string()
		.nullable()
		.url(() => getErrorMessage('cf_worker_url', 'invalid')),
	google_script_url: yup
		.string()
		.nullable()
		.url(() => getErrorMessage('google_script_url', 'invalid')),
	proxy_host: yup.string().nullable(),
	proxy_port: yup.string().nullable(),
	proxy_type: yup
		.string()
		.nullable()
		.oneOf<ProxyType>(
			[
				'CURLPROXY_HTTP',
				'CURLPROXY_SOCKS4',
				'CURLPROXY_SOCKS4A',
				'CURLPROXY_SOCKS5',
				'CURLPROXY_SOCKS5_HOSTNAME',
			],
			() => getErrorMessage('proxy_type', 'invalid'),
		),
	proxy_username: yup.string().nullable(),
	proxy_password: yup.string().nullable(),
});

export const parseModeSchema = yup.string().oneOf<ParseMode>(['none', 'HTML']);
