import { SectionCard } from '@wpsocio/components';
import { type FieldConditions, FormField } from '@wpsocio/form';
import { __ } from '@wpsocio/i18n';

import { getFieldLabel } from '../services';

const errorMessageConditions: FieldConditions = [
	{
		field: 'show_message_on_error',
		value: true,
		compare: '=',
	},
];

export const ErrorMessageOptions = () => {
	return (
		<SectionCard title={__('Error Message')}>
			<FormField
				description={__(
					"Display an error message if Telegram is blocked by user's ISP.",
				)}
				fieldType="switch"
				label={getFieldLabel('show_message_on_error')}
				name="show_message_on_error"
			/>

			<FormField
				conditions={errorMessageConditions}
				description={__('Leave empty for default.')}
				fieldType="text"
				label={getFieldLabel('custom_error_message')}
				name="custom_error_message"
			/>
		</SectionCard>
	);
};
