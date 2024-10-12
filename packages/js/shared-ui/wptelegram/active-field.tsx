import { FormControl } from '@wpsocio/ui-components/wrappers/form.js';
import { Switch } from '@wpsocio/ui-components/wrappers/switch.js';
import { prefixName } from '@wpsocio/utilities/misc.js';
import { FormField } from '../form/form-field.jsx';
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
						<Switch checked={field.value} onCheckedChange={field.onChange} />
					</FormControl>
				</FormItem>
			)}
		/>
	);
};
