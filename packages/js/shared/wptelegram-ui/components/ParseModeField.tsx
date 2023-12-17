import { Link } from '@wpsocio/adapters';
import { FormField, FormFieldProps } from '@wpsocio/form';
import { __ } from '@wpsocio/i18n';
import { prefixName } from '@wpsocio/utilities';

import { getFieldLabel } from '../services';
import type { CommonProps } from './types';

export type ParseModeFieldProps = Partial<
	FormFieldProps<'radio', Record<string, unknown>>
> &
	CommonProps;

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
	...props
}) => {
	return (
		<FormField
			name={prefixName('parse_mode', prefix)}
			fieldType="radio"
			label={getFieldLabel('parse_mode')}
			after={
				<Link
					color="blue.500"
					href="https://core.telegram.org/bots/api#html-style"
					isExternal
					mt="0.5rem"
					display="block"
				>
					{__('Learn more')}
				</Link>
			}
			options={getParseModeOptions()}
			{...props}
		/>
	);
};
