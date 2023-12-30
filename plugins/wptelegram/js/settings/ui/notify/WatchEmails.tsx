import { Stack, StackItem, StackProps } from '@wpsocio/adapters';
import { Code } from '@wpsocio/components';
import { FormField, useFormContext } from '@wpsocio/form';
import { useChatWithTest } from '@wpsocio/form-components';
import { __, sprintf } from '@wpsocio/i18n';
import { createInterpolateElement } from '@wpsocio/utilities';
import { DataShape, getFieldLabel } from '../../services';
import { Upsell } from '../shared/Upsell';
import { PREFIX } from './constants';

const direction: StackProps['direction'] = { base: 'column', '2xl': 'row' };

export const WatchEmails: React.FC = () => {
	const { watch } = useFormContext<DataShape>();
	const bot_token = watch('bot_token');
	const { button, result } = useChatWithTest(bot_token, false);

	return (
		<>
			<FormField
				description={createInterpolateElement(
					sprintf(
						/* translators: %s code */
						__(
							'If you want to receive notification for every email, then write %s.',
						),
						'<Code />',
					),
					{ Code: <Code>any</Code> },
				)}
				fieldType="text"
				label={getFieldLabel('watch_emails')}
				name={`${PREFIX}.watch_emails`}
				maxWidth="350px"
			/>
			<Upsell location="watch-emails" textAlign="center" />
			<Stack spacing={8} direction={direction} flexWrap="wrap">
				<StackItem flex={1} maxWidth="600px">
					<FormField
						button={button}
						description={__('Telegram User or Group Chat ID.')}
						fieldType="text.button"
						isRepeatable
						label={getFieldLabel('chat_ids')}
						name={`${PREFIX}.chat_ids`}
						placeholder="987654321 | My Personal ID"
					/>
				</StackItem>
				<StackItem flex={1}>{result}</StackItem>
			</Stack>
		</>
	);
};
