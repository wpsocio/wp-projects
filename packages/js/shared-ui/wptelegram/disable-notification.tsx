import { __, sprintf } from '@wpsocio/i18n';
import { FormControl } from '@wpsocio/ui/components/form';
import { Switch } from '@wpsocio/ui/wrappers/switch';
import { prefixName } from '@wpsocio/utilities/misc.js';
import { FormField } from '../form/form-field.js';
import { FormItem } from '../form/form-item.js';
import { getFieldLabel } from './fields.js';
import type { CommonProps } from './types.js';

export const DisableNotification: React.FC<CommonProps> = ({ prefix }) => {
	return (
		<FormField
			name={prefixName('disable_notification', prefix)}
			render={({ field }) => (
				<FormItem
					description={sprintf(
						'%s %s',
						__('Send the messages silently.'),
						__('Users will receive a notification with no sound.'),
					)}
					label={getFieldLabel('disable_notification')}
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
	);
};
