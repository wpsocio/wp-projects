import { useWatch } from '@wpsocio/form';
import { __ } from '@wpsocio/i18n';
import { FormControl } from '@wpsocio/ui-components/ui/form.jsx';
import { RadioGroup } from '@wpsocio/ui-components/wrappers/radio-group.js';
import { Switch } from '@wpsocio/ui-components/wrappers/switch.jsx';
import { prefixName } from '@wpsocio/utilities/misc.js';
import { useMemo } from 'react';
import { FormField } from '../form/form-field.js';
import { FormItem } from '../form/form-item.js';
import { getFieldLabel } from './fields.js';
import { SingleMessage } from './single-message.js';
import type { CommonProps } from './types.js';

export const ImageSettings: React.FC<CommonProps> = ({ prefix }) => {
	const isDisabled = !useWatch({
		name: prefixName('send_featured_image', prefix),
	});

	const image_position_options = useMemo(
		() => [
			{
				value: 'before',
				label: __('Before the Text'),
				isDisabled,
			},
			{
				value: 'after',
				label: __('After the Text'),
				isDisabled,
			},
		],
		[isDisabled],
	);
	return (
		<div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6 md:gap-2 my-6">
			<div>
				<FormField
					name={prefixName('send_featured_image', prefix)}
					render={({ field }) => (
						<FormItem
							className="flex-col"
							label={getFieldLabel('send_featured_image')}
							description={__('Send Featured Image (if exists).')}
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
			<div>
				<FormField
					name={prefixName('image_position', prefix)}
					render={({ field }) => (
						<FormItem
							label={getFieldLabel('image_position')}
							className="flex-col"
						>
							<FormControl>
								<RadioGroup
									{...field}
									onValueChange={field.onChange}
									defaultValue={field.value}
									options={image_position_options}
									disabled={isDisabled}
								/>
							</FormControl>
						</FormItem>
					)}
				/>
			</div>
			<div>
				<SingleMessage prefix={prefix} disabled={isDisabled} />
			</div>
		</div>
	);
};
