import { useWatch } from '@wpsocio/form';
import { __ } from '@wpsocio/i18n';
import { ActiveField } from '@wpsocio/shared-ui/wptelegram/active-field.js';
import { IfActive } from '@wpsocio/shared-ui/wptelegram/if-active.js';
import { P2TGInstructions } from '@wpsocio/shared-ui/wptelegram/p2tg-instructions.js';
import type { DataShape } from '../../services';
import { IfBotToken } from '../shared/if-bot-token';
import { PREFIX } from './constants';
import { Destination } from './destination.js';
import { MessageKeyboard } from './message-keyboard.js';
import { MessageSettings } from './message-settings.js';
import { Miscellaneous } from './miscellaneous.js';
import { Rules } from './rules.js';

export const P2TGTab: React.FC = () => {
	const bot_username = useWatch<DataShape, 'bot_username'>({
		name: 'bot_username',
	});

	return (
		<>
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
