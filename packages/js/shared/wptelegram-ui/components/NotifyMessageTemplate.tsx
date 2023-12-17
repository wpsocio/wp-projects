import { Text } from '@wpsocio/adapters';
import { Code } from '@wpsocio/components';
import { __ } from '@wpsocio/i18n';

import { MessageTemplate } from './MessageTemplate';
import type { CommonProps } from './types';

export const NotifyMessageTemplate: React.FC<CommonProps> = ({ prefix }) => {
	return (
		<MessageTemplate
			prefix={prefix}
			after={
				<>
					<Text as="span">
						{__('You can use any text, emojis or these macros in any order.')}
					</Text>
					<br />
					{['{email_subject}', '{email_message}'].map((tag, i) => (
						<Code key={tag}>{tag}</Code>
					))}
				</>
			}
		/>
	);
};
