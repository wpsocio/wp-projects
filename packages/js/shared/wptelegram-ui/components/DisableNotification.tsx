import { __, sprintf } from '@wpsocio/i18n';
import { FormField } from '@wpsocio/form';
import { prefixName } from '@wpsocio/utilities';

import { getFieldLabel } from '../services';
import type { CommonProps } from './types';

export const DisableNotification: React.FC<CommonProps> = ({ prefix }) => {
	return (
		<FormField
			description={sprintf(
				'%s %s',
				__('Send the messages silently.'),
				__('Users will receive a notification with no sound.'),
			)}
			fieldType="switch"
			label={getFieldLabel('disable_notification')}
			name={prefixName('disable_notification', prefix)}
		/>
	);
};
