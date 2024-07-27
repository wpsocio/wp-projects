import { FormField, type FormFieldProps } from '@wpsocio/form';
import { __ } from '@wpsocio/i18n';
import { prefixName } from '@wpsocio/utilities';

import { getFieldLabel } from '../services';
import type { CommonProps } from './types';

export type MessageTemplateProps = Partial<
	FormFieldProps<'textarea', Record<string, unknown>>
> &
	CommonProps;

export const MessageTemplate: React.FC<MessageTemplateProps> = ({ prefix }) => {
	return (
		<FormField
			name={prefixName('message_template', prefix)}
			fieldType="textarea"
			label={getFieldLabel('message_template')}
			description={__('Structure of the message to be sent.')}
			rows={10}
			height="auto"
			spellCheck={false}
		/>
	);
};
