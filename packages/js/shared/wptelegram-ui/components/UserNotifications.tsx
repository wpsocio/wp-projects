import { Text, Link } from '@wpsocio/adapters';
import { sprintf, __ } from '@wpsocio/i18n';
import { FormField } from '@wpsocio/form';
import { createInterpolateElement, prefixName } from '@wpsocio/utilities';

import { getFieldLabel } from '../services';
import type { CommonProps } from './types';

export interface UserNotificationsProps extends CommonProps {
	editProfileUrl?: string;
}

export const UserNotifications: React.FC<UserNotificationsProps> = ({
	prefix,
	editProfileUrl,
}) => {
	return (
		<>
			<FormField
				description={__(
					'Allow users receive their email notifications on Telegram.',
				)}
				fieldType="switch"
				label={getFieldLabel('user_notifications')}
				name={prefixName('user_notifications', prefix)}
			/>
			<Text mb="2em">
				{createInterpolateElement(
					/* translators: 1 Plugin name */
					sprintf(
						__('Use %s to let them connect their Telegram account.'),
						'<Link />',
					),
					{
						Link: (
							<Link
								href="https://wordpress.org/plugins/wptelegram-login"
								isExternal
							>
								{'WP Telegram Login & Register'}
							</Link>
						),
					},
				)}
				<br />
				{createInterpolateElement(
					/* translators: 1 profile page */
					sprintf(
						__(
							'They can also enter their Telegram Chat ID manually on %s page.',
						),
						'<Link />',
					),
					{
						Link: (
							<Link href={editProfileUrl} isExternal>
								{__('profile')}
							</Link>
						),
					},
				)}
			</Text>
		</>
	);
};
