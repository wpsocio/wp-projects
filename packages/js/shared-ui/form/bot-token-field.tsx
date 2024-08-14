import { useFormContext, useWatch } from '@wpsocio/form';
import { __ } from '@wpsocio/i18n';
import {
	FormControl,
	FormField,
} from '@wpsocio/ui-components/wrappers/form.js';
import { Input } from '@wpsocio/ui-components/wrappers/input.js';
import { useEffect } from 'react';
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
	const { setValue, trigger, control } = useFormContext();

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
			control={control}
			name={name}
			render={({ field }) => (
				<FormItem
					{...props}
					isRequired={isRequired}
					label={label}
					afterMessage={resultNode}
					description={__('Please read the instructions above.')}
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
