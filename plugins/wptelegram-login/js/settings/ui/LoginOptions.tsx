import { useFormContext, useWatch } from '@wpsocio/form';
import { __ } from '@wpsocio/i18n';
import { SectionCard } from '@wpsocio/shared-ui/components/section-card.js';
import { FormItem } from '@wpsocio/shared-ui/form/form-item';
import { cn } from '@wpsocio/ui/lib/utils';
import {
	FormControl,
	FormField,
} from '@wpsocio/ui/wrappers/form';
import { Input } from '@wpsocio/ui/wrappers/input';
import { RadioGroup } from '@wpsocio/ui/wrappers/radio-group';
import { Select } from '@wpsocio/ui/wrappers/select';
import { Switch } from '@wpsocio/ui/wrappers/switch';
import { useCallback, useState } from 'react';
import { type DataShape, getDomData, getFieldLabel } from '../services';

const getRedirectOptions = () => [
	{ value: 'default', label: __('Default') },
	{ value: 'homepage', label: __('Homepage') },
	{ value: 'current_page', label: __('Current page') },
	{ value: 'custom_url', label: __('Custom URL') },
];

const { uiData } = getDomData();

export const LoginOptions = () => {
	const [avatarMetaKeyReadOnly, setAvatarMetaKeyReadOnly] = useState(true);

	const onAvatarMetaDoubleClick = useCallback(
		() => setAvatarMetaKeyReadOnly(false),
		[],
	);

	const { control } = useFormContext<DataShape>();

	const [disableSignup, redirectTo] = useWatch({
		name: ['disable_signup', 'redirect_to'],
	});

	return (
		<SectionCard title={__('Login Options')}>
			<div className="flex flex-col gap-10 md:gap-4">
				<FormField
					control={control}
					name="disable_signup"
					render={({ field }) => (
						<FormItem
							label={getFieldLabel('disable_signup')}
							description={__(
								'If enabled, only the existing users who have connected their Telegram will be able to login.',
							)}
						>
							<FormControl>
								<Switch
									{...field}
									value={undefined}
									checked={field.value}
									onCheckedChange={field.onChange}
								/>
							</FormControl>
						</FormItem>
					)}
				/>
				<FormField
					control={control}
					name="user_role"
					render={({ field }) => (
						<FormItem
							label={getFieldLabel('user_role')}
							description={__('The default role to assign for the new users.')}
							className={cn({ '!hidden': disableSignup })}
						>
							<FormControl>
								<Select
									{...field}
									onValueChange={field.onChange}
									defaultValue={field.value}
									options={uiData.user_role}
								/>
							</FormControl>
						</FormItem>
					)}
				/>

				<FormField
					control={control}
					name="redirect_to"
					render={({ field }) => (
						<FormItem
							label={getFieldLabel('redirect_to')}
							description={__('Redirect location after login.')}
						>
							<FormControl>
								<RadioGroup
									{...field}
									onValueChange={field.onChange}
									defaultValue={field.value}
									options={getRedirectOptions()}
									displayInline
								/>
							</FormControl>
						</FormItem>
					)}
				/>

				<FormField
					control={control}
					name="redirect_url"
					render={({ field }) => (
						<FormItem
							label={getFieldLabel('redirect_url')}
							className={cn({ '!hidden': redirectTo !== 'custom_url' })}
						>
							<FormControl>
								<Input {...field} />
							</FormControl>
						</FormItem>
					)}
				/>

				<FormField
					control={control}
					name="avatar_meta_key"
					render={({ field }) => (
						<FormItem
							description={__(
								'The user meta key to be used to save Telegram photo URL.',
							)}
							label={getFieldLabel('avatar_meta_key')}
						>
							<FormControl className="max-w-[200px]">
								<Input
									autoComplete="off"
									readOnly={avatarMetaKeyReadOnly}
									onDoubleClick={onAvatarMetaDoubleClick}
									{...field}
								/>
							</FormControl>
						</FormItem>
					)}
				/>
				<FormField
					control={control}
					name="random_email"
					render={({ field }) => (
						<FormItem
							label={getFieldLabel('random_email')}
							description={`${__(
								'If enabled, a random email address will be generated for new user accounts.',
							)} ${__(
								'Useful when you want the users to be able to receive private notifications.',
							)}`}
							className={cn({ '!hidden': disableSignup })}
						>
							<FormControl>
								<Switch
									{...field}
									value={undefined}
									checked={field.value}
									onCheckedChange={field.onChange}
								/>
							</FormControl>
						</FormItem>
					)}
				/>
			</div>
		</SectionCard>
	);
};
