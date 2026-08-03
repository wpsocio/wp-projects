import { __ } from '@wpsocio/i18n';
import { Textarea } from '@wpsocio/ui/components/textarea';
import { FormControl } from '@wpsocio/ui/wrappers/form';
import { prefixName } from '@wpsocio/utilities/misc.js';
import { FormField } from '../form/form-field.js';
import { FormItem } from '../form/form-item.js';
import { getFieldLabel } from './fields.js';
import type { CommonProps } from './types.js';

export type MessageTemplateProps = CommonProps & {
	placeholder?: string;
};

export const MessageTemplate: React.FC<MessageTemplateProps> = ({
	prefix,
	placeholder,
}) => {
	return (
		<FormField
			name={prefixName('message_template', prefix)}
			render={({ field }) => (
				<FormItem
					label={getFieldLabel('message_template')}
					description={__('Structure of the message to be sent.')}
					controlWrapperClassName="max-w-full"
				>
					<FormControl>
						<Textarea
							placeholder={placeholder}
							rows={10}
							spellCheck={false}
							className="h-auto"
							{...field}
						/>
					</FormControl>
				</FormItem>
			)}
		/>
	);
};
