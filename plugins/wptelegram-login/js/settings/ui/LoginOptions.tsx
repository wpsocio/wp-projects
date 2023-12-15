import { useCallback, useState } from 'react';

import { SectionCard } from '@wpsocio/components';
import { FieldConditions, FormField } from '@wpsocio/form';
import { __ } from '@wpsocio/i18n';

import { getFieldLabel, useData } from '../services';

const getRedirectOptions = () => [
	{ value: 'default', label: __('Default') },
	{ value: 'homepage', label: __('Homepage') },
	{ value: 'current_page', label: __('Current page') },
	{ value: 'custom_url', label: __('Custom URL') },
];

const disableSignupConditions: FieldConditions = [
	{
		field: 'disable_signup',
		value: true,
		compare: '!=',
	},
];

const redirectConditions: FieldConditions = [
	{
		field: 'redirect_to',
		value: 'custom_url',
		compare: '=',
	},
];

export const LoginOptions = () => {
	const [avatarMetaKeyReadOnly, setAvatarMetaKeyReadOnly] = useState(true);

	const { uiData } = useData();

	const onAvatarMetaDoubleClick = useCallback(
		() => setAvatarMetaKeyReadOnly(false),
		[],
	);

	return (
		<SectionCard title={__('Login Options')}>
			<FormField
				description={__(
					'If enabled, only the existing users who have connected their Telegram will be able to login.',
				)}
				fieldType="switch"
				label={getFieldLabel('disable_signup')}
				name="disable_signup"
			/>
			<FormField
				conditions={disableSignupConditions}
				description={__('The default role to assign for the new users.')}
				fieldType="select"
				label={getFieldLabel('user_role')}
				name="user_role"
				options={uiData.user_role}
			/>

			<FormField
				description={__('Redirect location after login.')}
				fieldType="radio"
				isInline
				label={getFieldLabel('redirect_to')}
				name="redirect_to"
				options={getRedirectOptions()}
			/>

			<FormField
				conditions={redirectConditions}
				fieldType="text"
				label={getFieldLabel('redirect_url')}
				name="redirect_url"
			/>

			<FormField
				description={__(
					'The user meta key to be used to save Telegram photo URL.',
				)}
				fieldType="text"
				isReadOnly={avatarMetaKeyReadOnly}
				label={getFieldLabel('avatar_meta_key')}
				maxWidth="200px"
				name="avatar_meta_key"
				onDoubleClick={onAvatarMetaDoubleClick}
			/>
			<FormField
				conditions={disableSignupConditions}
				description={`${__(
					'If enabled, a random email address will be generated for new user accounts.',
				)} ${__(
					'Useful when you want the users to be able to receive private notifications.',
				)}`}
				fieldType="switch"
				label={getFieldLabel('random_email')}
				name="random_email"
			/>
		</SectionCard>
	);
};
