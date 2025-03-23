import { useFormContext } from '@wpsocio/form';
import { __, sprintf } from '@wpsocio/i18n';
import { SectionCard } from '@wpsocio/shared-ui/components/section-card.js';
import { BotTokenField } from '@wpsocio/shared-ui/form/bot-token-field';
import { FormItem } from '@wpsocio/shared-ui/form/form-item';
import { FormControl, FormField } from '@wpsocio/ui/wrappers/form';
import { Input } from '@wpsocio/ui/wrappers/input';
import { useCallback, useState } from 'react';
import { getFieldLabel } from '../services';

export const TelegramOptions = () => {
	const [botUsernameReadOnly, setBotUsernameReadOnly] = useState(true);
	const botUsernameDoubleClick = useCallback(
		() => setBotUsernameReadOnly(false),
		[],
	);

	const { control } = useFormContext();

	return (
		<SectionCard title={__('Telegram Options')}>
			<div className="flex flex-col gap-10 md:gap-4">
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
		</SectionCard>
	);
};
