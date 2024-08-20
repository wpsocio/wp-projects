import { __, sprintf } from '@wpsocio/i18n';
import { Alert } from '@wpsocio/ui-components/wrappers/alert.js';
import { Link } from '@wpsocio/ui-components/wrappers/link.js';
import { createInterpolateElement } from '@wpsocio/utilities/createInterpolateElement.js';

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
