import { __, sprintf } from '@wpsocio/i18n';
import {
	fieldLabels as sharedFieldLabels,
	parseModeSchema,
	proxySchema,
} from '@wpsocio/shared-wptelegram-ui';
import {
	BOT_TOKEN_REGEX,
	TG_CHAT_ID_REGEX,
	TG_PRIVATE_CHAT_ID_REGEX,
	TG_USERNAME_REGEX,
	fieldLabelGetter,
	getFormErrorMessage,
} from '@wpsocio/utilities';
import * as yup from 'yup';

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

export const validationSchema = yup.object({
	bot_token: yup
		.string()
		.matches(BOT_TOKEN_REGEX, {
			message: () => getErrorMessage('bot_token', 'invalid'),
			excludeEmptyString: true,
		})
		.required(() => getErrorMessage('bot_token', 'required')),
	bot_username: yup.string().matches(TG_USERNAME_REGEX, {
		message: () => getErrorMessage('bot_username', 'invalid'),
		excludeEmptyString: true,
	}),
	p2tg: yup.object({
		active: yup.boolean(),
		channels: yup
			.array()
			.compact((field) => !field.value)
			.of(
				yup.object({
					value: yup
						.string()
						.trim()
						// match @username and chat ID
						.matches(TG_CHAT_ID_REGEX, {
							message: () => getErrorMessage('chat_id', 'invalid'),
							excludeEmptyString: true,
						}),
				}),
			)
			.when('active', {
				is: true,
				then: (schema) =>
					schema
						.required(
							sprintf(
								/* translators: %s: field label */
								__('At least one %s is required.'),
								__('channel'),
							),
						)
						.min(
							1,
							sprintf(
								/* translators: %s: field label */
								__('At least one %s is required.'),
								__('channel'),
							),
						),
			}),
		send_when: yup
			.array()
			.of(
				yup
					.mixed<'new' | 'existing'>()
					.oneOf(['new', 'existing'], () =>
						getErrorMessage('send_when', 'invalid'),
					),
			),
		post_types: yup.array().of(yup.string()),
		rules: yup.array().of(
			yup.object({
				value: yup.array().of(
					yup.object({
						param: yup.string(),
						operator: yup.mixed<'in' | 'not_in'>().oneOf(['in', 'not_in']),
						values: yup.array().of(yup.mixed()),
					}),
				),
			}),
		),
		message_template: yup.string(),
		excerpt_source: yup
			.string()
			.oneOf<'post_content' | 'before_more' | 'post_excerpt'>([
				'post_content',
				'before_more',
				'post_excerpt',
			]),
		excerpt_length: yup
			.number()
			.integer()
			.positive()
			.typeError(() =>
				sprintf(
					/* translators: %s: field label */
					__('%s must be a number.'),
					getFieldLabel('excerpt_length'),
				),
			)
			// make sure it's >= 1
			.min(1)
			.max(300)
			.nullable(),
		excerpt_preserve_eol: yup.boolean(),
		send_featured_image: yup.boolean(),
		image_position: yup.mixed<'before' | 'after'>().oneOf(['before', 'after']),
		single_message: yup.boolean(),
		cats_as_tags: yup.boolean(),
		parse_mode: parseModeSchema,
		disable_web_page_preview: yup.boolean(),
		inline_button_text: yup.string(),
		inline_button_url: yup.string(),
		delay: yup
			.number()
			.nullable()
			.typeError(() =>
				sprintf(
					/* translators: %s: field label */
					__('%s must be a number.'),
					getFieldLabel('delay'),
				),
			)
			.positive()
			.min(0),
		disable_notification: yup.boolean(),
		protect_content: yup.boolean(),
	}),
	notify: yup.object({
		active: yup.boolean(),
		watch_emails: yup.string(),
		chat_ids: yup
			.array()
			.compact((field) => !field.value)
			.of(
				yup.object({
					value: yup
						.string()
						.trim()
						// match private chat ID.
						.matches(TG_PRIVATE_CHAT_ID_REGEX, {
							message: () => getErrorMessage('chat_id', 'invalid'),
							excludeEmptyString: true,
						}),
				}),
			),
		message_template: yup.string(),
		parse_mode: parseModeSchema,
	}),
	proxy: proxySchema,
	advanced: yup.object(),
});

export type DataShape = yup.InferType<typeof validationSchema>;

export const getErrorMessage = getFormErrorMessage(fieldLabels);
