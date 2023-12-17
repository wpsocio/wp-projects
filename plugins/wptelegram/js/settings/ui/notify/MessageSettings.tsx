import { Divider } from '@wpsocio/adapters';

import {
	NotifyMessageTemplate,
	ParseModeField,
} from '@wpsocio/shared-wptelegram-ui';

import { PREFIX } from './constants';

export const MessageSettings: React.FC = () => {
	return (
		<>
			<NotifyMessageTemplate prefix={PREFIX} />
			<Divider />
			<ParseModeField prefix={PREFIX} />
		</>
	);
};
