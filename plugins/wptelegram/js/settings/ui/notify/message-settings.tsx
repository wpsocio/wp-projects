import { NotifyMessageTemplate } from '@wpsocio/shared-ui/wptelegram/notify-message-template';
import { ParseModeField } from '@wpsocio/shared-ui/wptelegram/parse-mode-field';
import { Separator } from '@wpsocio/ui/components/separator';
import { PREFIX } from './constants';

export const MessageSettings: React.FC = () => {
	return (
		<>
			<NotifyMessageTemplate prefix={PREFIX} />
			<Separator className="my-6" />
			<ParseModeField prefix={PREFIX} asColumn={false} />
		</>
	);
};
