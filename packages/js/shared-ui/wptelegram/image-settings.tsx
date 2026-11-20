import { useWatch } from '@wpsocio/form';
import { __ } from '@wpsocio/i18n';
import { FormControl } from '@wpsocio/ui/components/form';
import { RadioGroup } from '@wpsocio/ui/wrappers/radio-group';
import { Switch } from '@wpsocio/ui/wrappers/switch';
import { prefixName } from '@wpsocio/utilities/misc.js';
import { useMemo } from 'react';
import { FormField } from '../form/form-field.js';
import { FormItem } from '../form/form-item.js';
import { getFieldLabel } from './fields.js';
import { SingleMessage } from './single-message.js';
import type { CommonProps } from './types.js';

export type ImageSettingsProps = CommonProps & {
	disabled?: boolean;
	disabledReason?: React.ReactNode;
};

export const ImageSettings: React.FC<ImageSettingsProps> = ({
	prefix,
	disabled = false,
	disabledReason,
}) => {
	const sendFeaturedImage = useWatch({
		name: prefixName('send_featured_image', prefix),
	});
	const areDependentFieldsDisabled = disabled || !sendFeaturedImage;

	const image_position_options = useMemo(
		() => [
			{
				value: 'before',
				label: __('Before the Text'),
				isDisabled: areDependentFieldsDisabled,
			},
			{
				value: 'after',
				label: __('After the Text'),
				isDisabled: areDependentFieldsDisabled,
			},
		],
		[areDependentFieldsDisabled],
	);
	return (
		<div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6 md:gap-2 my-6">
			<div>
				<FormField
					name={prefixName('send_featured_image', prefix)}
					render={({ field }) => (
						<FormItem
							className="md:flex-col"
							label={getFieldLabel('send_featured_image')}
							description={
								<>
									{__('Send Featured Image (if exists).')}
									{disabled && disabledReason ? (
										<span className="block text-destructive">
											{disabledReason}
										</span>
									) : null}
								</>
							}
							isDisabled={disabled}
						>
							<FormControl>
								<Switch
									{...field}
									value={undefined}
									checked={field.value}
									onCheckedChange={field.onChange}
									disabled={disabled}
									aria-readonly={disabled}
								/>
							</FormControl>
						</FormItem>
					)}
				/>
			</div>
			<div>
				<FormField
					name={prefixName('image_position', prefix)}
					render={({ field }) => (
						<FormItem
							label={getFieldLabel('image_position')}
							className="md:flex-col"
							isDisabled={areDependentFieldsDisabled}
						>
							<FormControl>
								<RadioGroup
									{...field}
									onValueChange={field.onChange}
									defaultValue={field.value}
									options={image_position_options}
									disabled={areDependentFieldsDisabled}
								/>
							</FormControl>
						</FormItem>
					)}
				/>
			</div>
			<div>
				<SingleMessage prefix={prefix} disabled={areDependentFieldsDisabled} />
			</div>
		</div>
	);
};
