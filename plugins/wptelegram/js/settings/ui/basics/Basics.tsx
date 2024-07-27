import { useCallback, useState } from 'react';

import { FormField } from '@wpsocio/form';
import { BotTokenField } from '@wpsocio/form-components';
import { __, sprintf } from '@wpsocio/i18n';

import { type DataShape, getFieldLabel } from '../../services';
import { Upsell } from '../shared/Upsell';
import { Instructions } from './Instructions';

export const Basics: React.FC = () => {
	const [botUsernameReadOnly, setBotUsernameReadOnly] = useState(true);
	const botUsernameDoubleClick = useCallback(
		() => setBotUsernameReadOnly(false),
		[],
	);

	return (
		<>
			<Instructions />
			<BotTokenField
				botUsernameField="bot_username"
				isRequired
				label={getFieldLabel('bot_token')}
				name="bot_token"
			/>
			<FormField<'text', DataShape>
				addonBefore="@"
				description={sprintf(
					/* translators: %s button name */
					__('Use %s above to set automatically.'),
					__('Test Token'),
				)}
				fieldType="text"
				isReadOnly={botUsernameReadOnly}
				label={getFieldLabel('bot_username')}
				maxW="220px"
				name="bot_username"
				onDoubleClick={botUsernameDoubleClick}
			/>
			<Upsell location="bot" textAlign="center" />
		</>
	);
};
