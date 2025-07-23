import { __, sprintf } from '@wpsocio/i18n';
import {
	BOT_TOKEN_REGEX,
	TG_USERNAME_REGEX,
} from '@wpsocio/utilities/constants.js';
import {
	fieldLabelGetter,
	getFormErrorMessage,
} from '@wpsocio/utilities/fields.js';
import { z } from 'zod';

export const fieldLabels = {
	bot_token: () => __('Bot Token'),
	bgcolor: () => __('Background color'),
	text_color: () => __('Text color'),
	username: () => __('Username'),
	width: () => __('Widget Width'),
	height: () => __('Widget Height'),
	author_photo: () => __('Author Photo'),
	num_messages: () => __('Number of Messages'),
	telegram_blocked: () => __('Host blocks Telegram'),
	google_script_url: () => __('Google Script URL'),
	url: () => __('Channel Link'),
	text: () => __('Button text'),
	post_types: () => __('Add to post types'),
	position: () => __('Position'),
	priority: () => __('Priority'),
	open_in_new_tab: () => __('Open in new tab'),
};

export const getFieldLabel = fieldLabelGetter(fieldLabels);

const ajaxWidgetSchema = {
	username: z.union([
		z
			.string()
			.regex(
				TG_USERNAME_REGEX,
				sprintf(__('Invalid %s'), getFieldLabel('username')),
			)
			.optional(),
		z.literal(''),
	]),
	width: z
		.string()
		.regex(
			/^[1-9]*?[0-9]*?(?:px|r?em|%)?$/,
			sprintf(__('Invalid %s'), getFieldLabel('width')),
		)
		.optional(),
	height: z
		.string()
		.regex(
			/^[1-9]*?[0-9]*?(?:px|r?em|%)?$/,
			sprintf(__('Invalid %s'), getFieldLabel('height')),
		)
		.optional(),
};

export const validationSchema = z.object({
	ajax_widget: z.object(ajaxWidgetSchema),
	legacy_widget: z
		.object({
			...ajaxWidgetSchema,
			bot_token: z.union([
				z
					.string()
					.regex(
						BOT_TOKEN_REGEX,
						sprintf(__('Invalid %s'), getFieldLabel('bot_token')),
					)
					.optional(),
				z.literal(''),
			]),
			author_photo: z.enum(['auto', 'always_show', 'always_hide']).optional(),
			num_messages: z
				.string()
				.regex(
					/^[1-5]?[0-9]?$/,
					sprintf(__('Invalid %s'), getFieldLabel('num_messages')),
				)
				.optional(),
		})
		// make bot token required when username is added
		.refine(
			(data) => {
				const result = Boolean(data.username) && !data.bot_token;

				if (result) {
					return false;
				}

				return true;
			},
			{
				error: () => sprintf(__('%s required.'), getFieldLabel('bot_token')),
				path: ['bot_token'],
			},
		),
	join_link: z.object({
		url: z.union([
			z.url(sprintf(__('Invalid %s'), getFieldLabel('url'))).optional(),
			z.literal(''),
		]),
		text: z.string().optional(),
		bgcolor: z.string().optional(),
		text_color: z.string().optional(),
		post_types: z.array(z.string()).optional(),
		position: z.enum(['before_content', 'after_content']).optional(),
		priority: z
			.string()
			.regex(/^[0-9]*$/, sprintf(__('Invalid %s'), getFieldLabel('priority')))
			.optional(),
		open_in_new_tab: z.boolean().optional(),
	}),
	advanced: z.object({
		telegram_blocked: z.boolean().optional(),
		google_script_url: z.union([
			z
				.string()
				.url(sprintf(__('Invalid %s'), getFieldLabel('google_script_url')))
				.optional(),
			z.literal(''),
		]),
	}),
});

export type DataShape = z.input<typeof validationSchema>;

export const getErrorMessage = getFormErrorMessage(fieldLabels);
