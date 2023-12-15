import * as yup from 'yup';

import { __ } from '@wpsocio/i18n';
import {
	BOT_TOKEN_REGEX,
	TG_USERNAME_REGEX,
	fieldLabelGetter,
	getFormErrorMessage,
} from '@wpsocio/utilities';

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

export const validationSchema = yup.object({
	bot_token: yup
		.string()
		.matches(BOT_TOKEN_REGEX, {
			message: () => getErrorMessage('bot_token', 'invalid'),
			excludeEmptyString: true,
		})
		.required(() => getErrorMessage('bot_token', 'required')),
	bot_username: yup
		.string()
		.matches(TG_USERNAME_REGEX, {
			message: () => getErrorMessage('bot_username', 'invalid'),
			excludeEmptyString: true,
		})
		.required(() => getErrorMessage('bot_username', 'required')),
	avatar_meta_key: yup
		.string()
		.matches(/^[a-z0-9_]+$/i, {
			message: () => getErrorMessage('avatar_meta_key', 'invalid'),
			excludeEmptyString: true,
		})
		.required(() => getErrorMessage('avatar_meta_key', 'required')),
	disable_signup: yup.bool(),
	random_email: yup.bool(),
	user_role: yup.string(),
	redirect_to: yup.string(),
	redirect_url: yup.string(),
	button_style: yup.string().oneOf(['large', 'medium', 'small']),
	show_user_photo: yup.bool(),
	corner_radius: yup.string().matches(/^[1-2]?[0-9]?$/, {
		message: () => getErrorMessage('corner_radius', 'invalid'),
		excludeEmptyString: true,
	}),
	show_if_user_is: yup.string(),
	hide_on_default: yup.bool(),
	show_message_on_error: yup.bool(),
	custom_error_message: yup.string(),
});

export type DataShape = ReturnType<typeof validationSchema.validateSync>;

export const getErrorMessage = getFormErrorMessage(fieldLabels);
