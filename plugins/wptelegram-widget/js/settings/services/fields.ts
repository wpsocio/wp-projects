import * as yup from 'yup';

import { __ } from '@wpsocio/i18n';
import {
	BOT_TOKEN_REGEX,
	TG_USERNAME_REGEX,
	fieldLabelGetter,
	getFormErrorMessage,
} from '@wpsocio/utilities';

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
	username: yup.string().matches(TG_USERNAME_REGEX, {
		message: () => getErrorMessage('username', 'invalid'),
		excludeEmptyString: true,
	}),
	width: yup.string().matches(/^[1-9]*?[0-9]*?(?:px|r?em|%)?$/, {
		message: () => getErrorMessage('width', 'invalid'),
		excludeEmptyString: true,
	}),
	height: yup.string().matches(/^[1-9]*?[0-9]*?(?:px|r?em|%)?$/i, {
		message: () => getErrorMessage('height', 'invalid'),
		excludeEmptyString: true,
	}),
};

export const validationSchema = yup.object({
	ajax_widget: yup.object(ajaxWidgetSchema),
	legacy_widget: yup.object({
		...ajaxWidgetSchema,
		bot_token: yup
			.string()
			.matches(BOT_TOKEN_REGEX, {
				message: () => getErrorMessage('bot_token', 'invalid'),
				excludeEmptyString: true,
			})
			// make bot token required when username is added
			.when('username', {
				is: (username: string) => Boolean(username),
				then: (schema) =>
					schema.required(() => getErrorMessage('bot_token', 'required')),
			}),
		author_photo: yup
			.mixed<'auto' | 'always_show' | 'always_hide'>()
			.oneOf(['auto', 'always_show', 'always_hide']),
		num_messages: yup.string().matches(/^[1-5]?[0-9]?$/, {
			message: () => getErrorMessage('num_messages', 'invalid'),
			excludeEmptyString: true,
		}),
	}),
	join_link: yup.object({
		url: yup
			.string()
			.nullable()
			.url(() => getErrorMessage('url', 'invalid')),
		text: yup.string().nullable(),
		text_color: yup.string().nullable(),
		bgcolor: yup.string().nullable(),
		post_types: yup.array().of(yup.string()),
		position: yup
			.mixed<'before_content' | 'after_content'>()
			.oneOf(['before_content', 'after_content']),
		priority: yup.string().matches(/^[0-9]*$/, {
			message: () => getErrorMessage('priority', 'invalid'),
			excludeEmptyString: true,
		}),
	}),
	advanced: yup.object({
		telegram_blocked: yup.boolean().nullable(),
		google_script_url: yup
			.string()
			.nullable()
			.url(() => getErrorMessage('google_script_url', 'invalid')),
	}),
});

export type DataShape = yup.InferType<typeof validationSchema>;

export const getErrorMessage = getFormErrorMessage(fieldLabels);
