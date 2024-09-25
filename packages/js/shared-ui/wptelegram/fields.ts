import { __ } from '@wpsocio/i18n';
import {
	fieldLabelGetter,
	getFormErrorMessage,
} from '@wpsocio/utilities/fields.js';
import { z } from 'zod';

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
	link_preview_disabled: () => __('Disable link preview'),
	link_preview_url: () => __('Link preview URL'),
	link_preview_above_text: () => __('Show preview above text'),
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

export const proxySchema = z.object({
	active: z.boolean(),
	proxy_method: z.enum(['cf_worker', 'google_script', 'php_proxy']).optional(),
	cf_worker_url: z.union([z.literal(''), z.string().url()]).nullish(),
	google_script_url: z.union([z.literal(''), z.string().url()]).nullish(),
	proxy_host: z.string().nullish(),
	proxy_port: z.string().nullish(),
	proxy_type: z
		.enum([
			'CURLPROXY_HTTP',
			'CURLPROXY_SOCKS4',
			'CURLPROXY_SOCKS4A',
			'CURLPROXY_SOCKS5',
			'CURLPROXY_SOCKS5_HOSTNAME',
		])
		.optional(),
	proxy_username: z.string().nullish(),
	proxy_password: z.string().nullish(),
});

export const parseModeSchema = z.enum(['none', 'HTML']);
