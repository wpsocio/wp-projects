import { useFormContext } from '@wpsocio/form';
import { __ } from '@wpsocio/i18n';
import { SectionCard } from '@wpsocio/shared-ui/components/section-card.js';
import { FormItem } from '@wpsocio/shared-ui/form/form-item';
import {
	FormControl,
	FormField,
} from '@wpsocio/ui-components/wrappers/form.js';

import { Input } from '@wpsocio/ui-components/wrappers/input';
import { RadioGroup } from '@wpsocio/ui-components/wrappers/radio-group';
import { Select } from '@wpsocio/ui-components/wrappers/select.js';
import { Switch } from '@wpsocio/ui-components/wrappers/switch';
import { getDomData, getFieldLabel } from '../services';

const getButtonStyleOptions = () => [
	{ value: 'large', label: __('Large') },
	{ value: 'medium', label: __('Medium') },
	{ value: 'small', label: __('Small') },
];

const { uiData } = getDomData();

export const ButtonOptions = () => {
	const { control } = useFormContext();

	return (
		<SectionCard title={__('Button Options')}>
			<div className="flex flex-col gap-10 md:gap-4">
				<FormField
					control={control}
					name="button_style"
					render={({ field }) => (
						<FormItem label={getFieldLabel('button_style')}>
							<FormControl>
								<RadioGroup
									{...field}
									onValueChange={field.onChange}
									defaultValue={field.value}
									options={getButtonStyleOptions()}
									displayInline
								/>
							</FormControl>
						</FormItem>
					)}
				/>

				<FormField
					control={control}
					name="show_user_photo"
					render={({ field }) => (
						<FormItem
							label={getFieldLabel('show_user_photo')}
							description={__(
								'Display Telegram user profile photo beside button.',
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
					name="corner_radius"
					render={({ field }) => (
						<FormItem
							description={__('Leave empty for default.')}
							label={getFieldLabel('corner_radius')}
						>
							<FormControl className="max-w-[100px]">
								<Input type="number" max={20} min={1} {...field} />
							</FormControl>
						</FormItem>
					)}
				/>

				<FormField
					control={control}
					name="lang"
					render={({ field }) => (
						<FormItem
							description={__('Language for the login button.')}
							label={getFieldLabel('lang')}
						>
							<FormControl>
								<Select
									{...field}
									onValueChange={field.onChange}
									defaultValue={field.value}
									options={uiData.lang}
								/>
							</FormControl>
						</FormItem>
					)}
				/>

				<FormField
					control={control}
					name="show_if_user_is"
					render={({ field }) => (
						<FormItem
							label={getFieldLabel('show_if_user_is')}
							description={__('Who can see the login button.')}
						>
							<FormControl>
								<Select
									{...field}
									onValueChange={field.onChange}
									defaultValue={field.value}
									options={uiData.show_if_user_is}
								/>
							</FormControl>
						</FormItem>
					)}
				/>

				<FormField
					control={control}
					name="hide_on_default"
					render={({ field }) => (
						<FormItem
							label={getFieldLabel('hide_on_default')}
							description={__(
								'Hide the button on default WordPress login/register page.',
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
			</div>
		</SectionCard>
	);
};
