import { SectionCard } from '@wpsocio/components';
import { FormField } from '@wpsocio/form';
import { BotTokenField } from '@wpsocio/form-components';
import { __, sprintf } from '@wpsocio/i18n';
import { useCallback, useState } from 'react';
import { getFieldLabel } from '../services';

export const TelegramOptions = () => {
	const [botUsernameReadOnly, setBotUsernameReadOnly] = useState(true);
	const botUsernameDoubleClick = useCallback(
		() => setBotUsernameReadOnly(false),
		[],
	);

	return (
		<SectionCard title={__('Telegram Options')}>
			<BotTokenField
				botUsernameField="bot_username"
				isRequired
				label={getFieldLabel('bot_token')}
				name="bot_token"
			/>

			<FormField
				addonBefore="@"
				description={sprintf(
					__('Use %s above to set automatically.'),
					__('Test Token'),
				)}
				isRequired
				fieldType="text"
				isReadOnly={botUsernameReadOnly}
				label={getFieldLabel('bot_username')}
				maxW="200px"
				name="bot_username"
				onDoubleClick={botUsernameDoubleClick}
			/>
		</SectionCard>
	);
};
