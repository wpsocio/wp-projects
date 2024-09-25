import { useFormContext } from '@wpsocio/form';
import { __, sprintf } from '@wpsocio/i18n';
import { BotTokenField } from '@wpsocio/shared-ui/form/bot-token-field';
import { FormItem } from '@wpsocio/shared-ui/form/form-item';
import {
	FormControl,
	FormField,
} from '@wpsocio/ui-components/wrappers/form.js';
import { Input } from '@wpsocio/ui-components/wrappers/input.js';
import { useCallback, useState } from 'react';
import { getFieldLabel } from '../../services';
import { Upsell } from '../shared/pro-upsell';
import { Instructions } from './instructions';

export const BasicsTab: React.FC = () => {
	const [botUsernameReadOnly, setBotUsernameReadOnly] = useState(true);
	const botUsernameDoubleClick = useCallback(
		() => setBotUsernameReadOnly(false),
		[],
	);
	const { control } = useFormContext();

	return (
		<>
			<Instructions />
			<div className="flex flex-col gap-10 md:gap-4 mb-8">
				<BotTokenField
					botUsernameField="bot_username"
					isRequired
					label={getFieldLabel('bot_token')}
					name="bot_token"
				/>

				<FormField
					control={control}
					name="bot_username"
					render={({ field }) => (
						<FormItem
							label={getFieldLabel('bot_username')}
							description={sprintf(
								__('Use %s above to set automatically.'),
								__('Test Token'),
							)}
						>
							<FormControl className="max-w-[200px]">
								<Input
									addonStart="@"
									required
									autoComplete="off"
									readOnly={botUsernameReadOnly}
									onDoubleClick={botUsernameDoubleClick}
									{...field}
								/>
							</FormControl>
						</FormItem>
					)}
				/>
			</div>
			<Upsell location="bot" />
		</>
	);
};
