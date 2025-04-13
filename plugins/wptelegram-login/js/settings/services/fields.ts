import { __, sprintf } from '@wpsocio/i18n';
import {
	BOT_TOKEN_REGEX,
	TG_USERNAME_REGEX,
} from '@wpsocio/utilities/constants';
import {
	fieldLabelGetter,
	getFormErrorMessage,
} from '@wpsocio/utilities/fields';
import { z } from 'zod';

export const fieldLabels = {
	avatar_meta_key: () => __('Avatar URL Meta Key'),
	bot_token: () => __('Bot Token'),
	bot_username: () => __('Bot Username'),
	button_style: () => __('Button Style'),
	corner_radius: () => __('Corner Radius'),
	custom_error_message: () => __('Error message text'),
	disable_signup: () => __('Disable Sign up'),
	hide_on_default: () => __('Hide on default login'),
	random_email: () => __('Random Email'),
	redirect_to: () => __('Redirect to'),
	redirect_url: () => __('Custom URL'),
	show_if_user_is: () => __('Show if user is'),
	lang: () => __('Language'),
	show_message_on_error: () => __('Show error message'),
	show_user_photo: () => __('Show User Photo'),
	user_role: () => __('User Role'),
};

export const getFieldLabel = fieldLabelGetter(fieldLabels);

export const validationSchema = z.object({
	// Basic settings
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
	// Login options
	disable_signup: z.boolean().optional(),
	user_role: z.string().optional(),
	redirect_to: z.string().optional(),
	redirect_url: z.string().optional(),
	avatar_meta_key: z
		.string()
		.min(1, sprintf(__('%s required.'), getFieldLabel('avatar_meta_key')))
		.regex(
			/^[a-z0-9_]+$/i,
			sprintf(__('Invalid %s'), getFieldLabel('avatar_meta_key')),
		),
	random_email: z.boolean().optional(),
	// Button options
	button_style: z.enum(['large', 'medium', 'small']).optional(),
	show_user_photo: z.boolean().optional(),
	corner_radius: z
		.string()
		.regex(
			/^[1-2]?[0-9]?$/,
			sprintf(__('Invalid %s'), getFieldLabel('corner_radius')),
		)
		.optional(),
	lang: z.string().optional(),
	show_if_user_is: z.string().optional(),
	hide_on_default: z.boolean().optional(),
	// Error message
	show_message_on_error: z.boolean().optional(),
	custom_error_message: z.string().optional(),
});

export type DataShape = z.input<typeof validationSchema>;

export const getErrorMessage = getFormErrorMessage(fieldLabels);
