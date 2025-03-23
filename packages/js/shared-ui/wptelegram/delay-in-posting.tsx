import { useWatch } from '@wpsocio/form';
import { __ } from '@wpsocio/i18n';
import { Warning } from '@wpsocio/ui/icons';
import { FormControl } from '@wpsocio/ui/components/form';
import { Alert } from '@wpsocio/ui/wrappers/alert';
import { Input } from '@wpsocio/ui/wrappers/input';
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
	const delay = Number(useWatch({ name: prefixName('delay', prefix) }));

	return (
		<FormField
			name={prefixName('delay', prefix)}
			render={({ field }) => (
				<FormItem
					label={getFieldLabel('delay')}
					description={__('The delay starts after the post gets published.')}
					afterMessage={
						is_wp_cron_disabled && delay ? (
							<Alert
								type="error"
								title={__('Warning')}
								className="max-w-max"
								icon={<Warning size="16" />}
							>
								{__('WordPress cron should not be disabled!')}
							</Alert>
						) : null
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
