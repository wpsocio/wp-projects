import { __ } from '@wpsocio/i18n';
import { FormControl } from '@wpsocio/ui-components/ui/form.js';
import { Input } from '@wpsocio/ui-components/wrappers/input.js';
import { prefixName } from '@wpsocio/utilities/misc.js';
import { FormField } from '../form/form-field.js';
import { FormItem } from '../form/form-item.js';
import { getFieldLabel } from './fields.js';
import type { CommonProps } from './types.js';

export interface DelayInPostingProps extends CommonProps {
	is_wp_cron_disabled?: boolean;
}

export const DelayInPosting: React.FC<DelayInPostingProps> = ({
	is_wp_cron_disabled,
	prefix,
}) => {
	return (
		<FormField
			name={prefixName('delay', prefix)}
			render={({ field }) => (
				<FormItem
					label={getFieldLabel('delay')}
					description={__('The delay starts after the post gets published.')}
					afterMessage={
						is_wp_cron_disabled && (
							<p className="text-destructive">
								{__('WordPress cron should not be disabled!')}
							</p>
						)
					}
				>
					<FormControl className="max-w-[100px]">
						<Input type="number" max={300} min={0} step="any" {...field} />
					</FormControl>
					&nbsp;{__('Minute(s)')}
				</FormItem>
			)}
		/>
	);
};
