import { useFormContext } from '@wpsocio/form';
import { __, sprintf } from '@wpsocio/i18n';
import { Code } from '@wpsocio/shared-ui/components/code';
import { FormField } from '@wpsocio/shared-ui/form/form-field';
import { FormItem } from '@wpsocio/shared-ui/form/form-item';
import { ChannelsField } from '@wpsocio/shared-ui/wptelegram/channels-field';
import { FormControl } from '@wpsocio/ui-components/ui/form.jsx';
import { Input } from '@wpsocio/ui-components/wrappers/input';
import { createInterpolateElement } from '@wpsocio/utilities';
import { type DataShape, getFieldLabel } from '../../services/fields';
import { Upsell } from '../shared/pro-upsell';
import { PREFIX } from './constants';

export const WatchEmails: React.FC = () => {
	const { watch } = useFormContext<DataShape>();
	const bot_token = watch('bot_token');

	return (
		<>
			<FormField
				name={`${PREFIX}.watch_emails`}
				render={({ field }) => (
					<FormItem
						label={getFieldLabel('watch_emails')}
						description={createInterpolateElement(
							sprintf(
								/* translators: %s code */
								__(
									'If you want to receive notification for every email, then write %s.',
								),
								'<Code />',
							),
							{ Code: <Code>{'any'}</Code> },
						)}
					>
						<FormControl className="max-w-[350px]">
							<Input autoComplete="email" {...field} />
						</FormControl>
					</FormItem>
				)}
			/>
			<Upsell location="watch-emails" />
			<ChannelsField
				name={`${PREFIX}.chat_ids`}
				label={getFieldLabel('chat_ids')}
				bot_token={bot_token}
				description={__('Telegram User or Group Chat ID.')}
				aria-label={__('Telegram User or Group Chat ID')}
				placeholder="987654321 | My Personal ID"
				showMemberCount={false}
			/>
		</>
	);
};
