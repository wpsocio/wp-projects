import { __ } from '@wpsocio/i18n';
import { FormControl } from '@wpsocio/ui-components/ui/form.jsx';
import { Link } from '@wpsocio/ui-components/wrappers/link.jsx';
import { RadioGroup } from '@wpsocio/ui-components/wrappers/radio-group.js';
import { prefixName } from '@wpsocio/utilities/misc.js';
import { FormField } from '../form/form-field.js';
import { FormItem } from '../form/form-item.js';
import { getFieldLabel } from './fields.js';
import type { CommonProps } from './types.js';

export type ParseModeFieldProps = CommonProps & {
	asColumn?: boolean;
};

export const getParseModeOptions = () => [
	{
		value: 'none',
		label: __('None'),
	},
	{
		value: 'HTML',
		label: __('HTML style'),
	},
];

export const ParseModeField: React.FC<ParseModeFieldProps> = ({
	prefix,
	asColumn = true,
}) => {
	return (
		<FormField
			name={prefixName('parse_mode', prefix)}
			render={({ field }) => (
				<FormItem
					className={asColumn ? 'flex-col' : ''}
					label={getFieldLabel('parse_mode')}
					description={
						<Link
							href="https://core.telegram.org/bots/api#html-style"
							isExternal
						>
							{__('Learn more')}
						</Link>
					}
				>
					<FormControl>
						<RadioGroup
							{...field}
							onValueChange={field.onChange}
							defaultValue={field.value}
							options={getParseModeOptions()}
						/>
					</FormControl>
				</FormItem>
			)}
		/>
	);
};
