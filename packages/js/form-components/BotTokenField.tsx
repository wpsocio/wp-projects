import { useEffect } from 'react';

import { FormField, useFormContext, useWatch } from '@wpsocio/form';
import { __ } from '@wpsocio/i18n';

import { useBotTokenTest } from './useBotTokenTest';

const botTokenAddonProps = { px: '0' };

export type BotTokenFieldProps = {
	botUsernameField?: string;
	isRequired?: boolean;
	label: React.ReactNode;
	name: string;
};

export const BotTokenField: React.FC<BotTokenFieldProps> = ({
	botUsernameField,
	isRequired = true,
	label,
	name,
}) => {
	const { setValue, trigger } = useFormContext();

	const bot_token: string = useWatch({ name });

	const { bot_username, buttonNode, resultNode } = useBotTokenTest(bot_token);

	useEffect(() => {
		if (botUsernameField && bot_username) {
			setValue(botUsernameField, bot_username);
			trigger(botUsernameField);
		}
	}, [botUsernameField, bot_username, setValue, trigger]);

	return (
		<FormField
			addonAfter={buttonNode}
			addonAfterProps={botTokenAddonProps}
			after={resultNode}
			borderEnd="0"
			borderEndRadius="0"
			description={__('Please read the instructions above.')}
			fieldType="text"
			isRequired={isRequired}
			label={label}
			maxW="350px"
			name={name}
		/>
	);
};
