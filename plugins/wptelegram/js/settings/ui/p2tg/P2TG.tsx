import { Description } from '@wpsocio/components';
import { useWatch } from '@wpsocio/form';
import { __ } from '@wpsocio/i18n';

import {
	ActiveField,
	IfActive,
	P2TGInstructions,
} from '@wpsocio/shared-wptelegram-ui';

import type { DataShape } from '../../services';
import { IfBotToken } from '../shared/IfBotToken';
import { Destination } from './Destination';
import { MessageKeyboard } from './MessageKeyboard';
import { MessageSettings } from './MessageSettings';
import { Miscellaneous } from './Miscellaneous';
import { Rules } from './Rules';
import { PREFIX } from './constants';

export const P2TG: React.FC = () => {
	const bot_username = useWatch<DataShape, 'bot_username'>({
		name: 'bot_username',
	});

	return (
		<>
			<Description>
				{__(
					'With this module, you can configure how the posts are sent to Telegram.',
				)}
			</Description>

			<ActiveField prefix={PREFIX} />

			<IfActive name={`${PREFIX}.active`}>
				<IfBotToken>
					<P2TGInstructions
						botUsername={bot_username || ''}
						videoId="m48V-gWz9-o"
					/>
					<Destination />
					<Rules />
					<MessageSettings />
					<MessageKeyboard />
					<Miscellaneous />
				</IfBotToken>
			</IfActive>
		</>
	);
};
