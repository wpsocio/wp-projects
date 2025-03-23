import { FormControl } from '@wpsocio/ui/wrappers/form';
import { Switch } from '@wpsocio/ui/wrappers/switch';
import { prefixName } from '@wpsocio/utilities/misc.js';
import { FormField } from '../form/form-field.js';
import { FormItem } from '../form/form-item.js';
import { getFieldLabel } from './fields.js';
import type { CommonProps } from './types.js';

export const ActiveField: React.FC<CommonProps> = ({ prefix }) => {
	return (
		<FormField
			name={prefixName('active', prefix)}
			render={({ field }) => (
				<FormItem label={getFieldLabel('active')}>
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
