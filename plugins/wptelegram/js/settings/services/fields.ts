import { __, sprintf } from '@wpsocio/i18n';
import {
	parseModeSchema,
	proxySchema,
	fieldLabels as sharedFieldLabels,
} from '@wpsocio/shared-ui/wptelegram/fields';
import {
	BOT_TOKEN_REGEX,
	TG_CHAT_ID_REGEX,
	TG_PRIVATE_CHAT_ID_REGEX,
	TG_USERNAME_REGEX,
} from '@wpsocio/utilities/constants.js';
import {
	fieldLabelGetter,
	getFormErrorMessage,
} from '@wpsocio/utilities/fields.js';
import { z } from 'zod';

export const fieldLabels = {
	...sharedFieldLabels,
	inline_button_text: () => __('Inline button text'),
	inline_button_url: () => __('Inline button URL'),
	inline_url_button: () => __('Add Inline URL Button'),
	misc: () => __('Other settings'),
	post_types: () => __('Post type'),
	proxy_method: () => __('Proxy Method'),
	send_when: () => __('Send when'),
	watch_emails: () => __('If Email goes to'),
};

export const getFieldLabel = fieldLabelGetter(fieldLabels);

export const validationSchema = z.object({
	bot_token: z
		.string()
		.min(1, sprintf(__('%s required.'), getFieldLabel('bot_token')))
		.regex(
			BOT_TOKEN_REGEX,
			sprintf(__('Invalid %s'), getFieldLabel('bot_token')),
		),
	bot_username: z
		.string()
		.min(1, sprintf(__('%s required.'), getFieldLabel('bot_username')))
		.regex(
			TG_USERNAME_REGEX,
			sprintf(__('Invalid %s'), getFieldLabel('bot_username')),
		),
	p2tg: z
		.object({
			active: z.boolean().optional(),
			channels: z
				.array(
					z.object({
						value: z.union([
							z.literal(''),
							z
								.string()
								.trim()
								// match @username and chat ID
								.regex(
									TG_CHAT_ID_REGEX,
									sprintf(
										/* translators: %s: field name */
										__('Invalid %s'),
										getFieldLabel('channels'),
									),
								),
						]),
					}),
				)
				.optional()
				.transform((value) => value?.filter(Boolean)),
			send_when: z.array(z.enum(['new', 'existing'])).optional(),
			post_types: z.array(z.string()).optional(),
			rules: z
				.array(
					z.object({
						value: z.array(
							z.object({
								param: z.string(),
								operator: z.enum(['in', 'not_in']),
								values: z.array(z.any()).optional(),
							}),
						),
					}),
				)
				.optional(),
			message_template: z.string().optional(),
			// Excerpt settings
			excerpt_source: z
				.enum(['post_content', 'before_more', 'post_excerpt'])
				.optional(),
			excerpt_length: z.coerce.number().int().min(1).max(300).optional(),
			excerpt_preserve_eol: z.boolean().optional(),
			// Image settings
			send_featured_image: z.boolean().optional(),
			image_position: z.enum(['before', 'after']).optional(),
			single_message: z.boolean().optional(),
			// Additional settings
			cats_as_tags: z.boolean().optional(),
			parse_mode: parseModeSchema,
			protect_content: z.boolean().optional(),
			// Link preview settings
			link_preview_disabled: z.boolean().optional(),
			link_preview_url: z.string().optional(),
			link_preview_above_text: z.boolean().optional(),
			// Inline button settings
			inline_url_button: z.boolean().optional(),
			inline_button_text: z.string().optional(),
			inline_button_url: z.string().optional(),
			// Misc settings
			post_edit_switch: z.boolean().optional(),
			plugin_posts: z.boolean().optional(),
			delay: z.coerce.number().min(0).optional(),
			disable_notification: z.boolean().optional(),
		})
		.refine(
			(value) =>
				// If the section is not active, we are good.
				!value.active ||
				// Otherwise, we need at least one channel.
				value.channels?.filter((c) => c.value.trim())?.length,
			{
				error: () =>
					sprintf(
						/* translators: %s: field label */
						__('At least one %s is required.'),
						__('channel'),
					),
				path: ['channels'],
			},
		),
	notify: z
		.object({
			active: z.boolean().optional(),
			watch_emails: z.string().optional(),
			chat_ids: z
				.array(
					z.object({
						value: z.union([
							z.literal(''),
							z
								.string()
								.trim()
								// match private chat ID.
								.regex(
									TG_PRIVATE_CHAT_ID_REGEX,
									sprintf(__('Invalid %s'), getFieldLabel('chat_id')),
								),
						]),
					}),
				)
				.optional()
				.transform((value) => value?.filter(Boolean)),
			user_notifications: z.boolean().optional(),
			message_template: z.string().optional(),
			parse_mode: parseModeSchema,
		})
		.refine(
			(value) =>
				// If the section is not active, we are good.
				!value.active ||
				// Otherwise, we need at least one chat ID.
				value.chat_ids?.filter((c) => c.value.trim())?.length ||
				// or user notifications enabled.
				value.user_notifications,
			{
				error: () =>
					sprintf(
						/* translators: %s: field label */
						__('At least one %s is required.'),
						__('chat ID'),
					),
				path: ['chat_ids'],
			},
		),
	proxy: proxySchema,
	advanced: z.object({
		send_files_by_url: z.boolean().optional(),
		enable_logs: z.array(z.enum(['bot_api', 'p2tg'])),
		clean_uninstall: z.boolean().optional(),
	}),
});

export type DataShape = z.input<typeof validationSchema>;

export const getErrorMessage = getFormErrorMessage(fieldLabels);
