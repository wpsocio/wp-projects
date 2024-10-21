import { __ } from '@wpsocio/i18n';
import { VariableButton } from '../components/variable-button.js';
import { MessageTemplate } from './message-template.js';
import type { CommonProps } from './types.js';

export const NotifyMessageTemplate: React.FC<CommonProps> = ({ prefix }) => {
	return (
		<>
			<MessageTemplate prefix={prefix} />
			<div className="mt-4">
				<span>
					{__('You can use any text, emojis or these variables in any order.')}
				</span>
				&nbsp;
				{['{email_subject}', '{email_message}'].map((tag) => (
					<VariableButton key={tag} content={tag} />
				))}
			</div>
		</>
	);
};
