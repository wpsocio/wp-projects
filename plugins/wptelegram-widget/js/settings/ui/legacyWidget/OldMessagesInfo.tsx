import { __ } from '@wpsocio/i18n';
import { Alert } from '@wpsocio/ui/wrappers/alert';

export function OldMessagesInfo() {
	return (
		<div>
			<Alert type="info" title={__('Old Messages')}>
				{__('Legacy Widget does not show the old messages.')}
				<br />
				<br />
				{__(
					'You need to post something new into the group/channel and wait for five minutes for the messages to appear.',
				)}
			</Alert>
		</div>
	);
}
