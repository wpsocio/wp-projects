import { useFormContext, useWatch } from '@wpsocio/form';
import { __ } from '@wpsocio/i18n';
import { FormControl } from '@wpsocio/ui-components/wrappers/form.js';
import { Input } from '@wpsocio/ui-components/wrappers/input.js';
import { useEffect } from 'react';
import { FormField } from './form-field.jsx';
import { FormItem } from './form-item.js';
import { useBotTokenTest } from './use-bot-token-test.js';

export type BotTokenFieldProps = React.HTMLAttributes<HTMLDivElement> & {
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
	...props
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
			name={name}
			render={({ field }) => (
				<FormItem
					isRequired={isRequired}
					label={label}
					afterMessage={resultNode}
					description={__('Please read the instructions above.')}
					{...props}
				>
					<FormControl>
						<Input required={isRequired} autoComplete="off" {...field} />
					</FormControl>
					{buttonNode}
				</FormItem>
			)}
		/>
	);
};
