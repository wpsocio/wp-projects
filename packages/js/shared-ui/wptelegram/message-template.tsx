import { __ } from '@wpsocio/i18n';
import { Textarea } from '@wpsocio/ui-components/ui/textarea.js';
import { FormControl } from '@wpsocio/ui-components/wrappers/form.js';
import { prefixName } from '@wpsocio/utilities/misc.js';
import { FormField } from '../form/form-field.js';
import { FormItem } from '../form/form-item.js';
import { getFieldLabel } from './fields.js';
import type { CommonProps } from './types.js';

export type MessageTemplateProps = CommonProps;

export const MessageTemplate: React.FC<MessageTemplateProps> = ({ prefix }) => {
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
