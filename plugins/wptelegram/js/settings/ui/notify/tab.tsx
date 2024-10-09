import { useWatch } from '@wpsocio/form';
import { __ } from '@wpsocio/i18n';
import { SectionCard } from '@wpsocio/shared-ui/components/section-card';
import { ActiveField } from '@wpsocio/shared-ui/wptelegram/active-field.js';
import { IfActive } from '@wpsocio/shared-ui/wptelegram/if-active.js';
import { NotifyInstructions } from '@wpsocio/shared-ui/wptelegram/notify-instructions.js';
import { UserNotifications } from '@wpsocio/shared-ui/wptelegram/user-notifications.js';
import { Separator } from '@wpsocio/ui-components/ui/separator';
import type { DataShape } from '../../services/fields';
import { useData } from '../../services/useData';
import { IfBotToken } from '../shared/if-bot-token';
import { PREFIX } from './constants';
import { MessageSettings } from './message-settings.js';
import { WatchEmails } from './watch-emails.js';

export const NotifyTab: React.FC = () => {
	const { editProfileUrl } = useData('assets');
	const bot_username = useWatch<DataShape, 'bot_username'>({
		name: 'bot_username',
	});

	return (
		<>
			<ActiveField prefix={PREFIX} />

			<IfActive name={`${PREFIX}.active`}>
				<IfBotToken>
					<NotifyInstructions
						botUsername={bot_username || ''}
						videoId="gVJCtwkorMA"
					/>
					<SectionCard title={__('Notification Settings')}>
						<WatchEmails />
						<Separator className="my-6" />
						<UserNotifications
							editProfileUrl={editProfileUrl}
							prefix={PREFIX}
						/>
						<MessageSettings />
					</SectionCard>
				</IfBotToken>
			</IfActive>
		</>
	);
};
