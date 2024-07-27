import { Divider } from '@wpsocio/adapters';
import { Description, SectionCard } from '@wpsocio/components';
import { useWatch } from '@wpsocio/form';
import { __ } from '@wpsocio/i18n';

import {
	ActiveField,
	IfActive,
	NotifyInstructions,
	UserNotifications,
} from '@wpsocio/shared-wptelegram-ui';

import { type DataShape, useData } from '../../services';
import { IfBotToken } from '../shared/IfBotToken';
import { MessageSettings } from './MessageSettings';
import { WatchEmails } from './WatchEmails';
import { PREFIX } from './constants';

export const Notify: React.FC = () => {
	const { editProfileUrl } = useData('assets');
	const bot_username = useWatch<DataShape, 'bot_username'>({
		name: 'bot_username',
	});

	return (
		<>
			<Description>
				{__(
					'The module will watch the Email Notifications sent from this site and deliver them to you on Telegram.',
				)}
			</Description>

			<ActiveField prefix={PREFIX} />

			<IfActive name={`${PREFIX}.active`}>
				<IfBotToken>
					<NotifyInstructions
						botUsername={bot_username || ''}
						videoId="gVJCtwkorMA"
					/>
					<SectionCard title={__('Notification Settings')}>
						<WatchEmails />
						<Divider mt="2em" />
						<UserNotifications
							editProfileUrl={editProfileUrl}
							prefix={PREFIX}
						/>
						<MessageSettings />
					</SectionCard>
					<Divider />
				</IfBotToken>
			</IfActive>
		</>
	);
};
