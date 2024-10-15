import { useFormContext, useWatch } from '@wpsocio/form';
import { BotTokenField } from '@wpsocio/shared-ui/form/bot-token-field.js';
import { useEffect } from 'react';
import { type DataShape, getFieldLabel } from '../../services';
import { PREFIX } from './constants';

export const BotToken: React.FC = () => {
	const { trigger } = useFormContext<DataShape>();

	const username = useWatch<DataShape>({ name: `${PREFIX}.username` as const });

	useEffect(() => {
		if (!username) {
			// trigger validation for bot_token when username is removed
			trigger(`${PREFIX}.bot_token` as const);
		}
	}, [trigger, username]);

	return (
		<BotTokenField
			name={`${PREFIX}.bot_token`}
			isRequired={Boolean(username)}
			label={getFieldLabel('bot_token')}
		/>
	);
};
