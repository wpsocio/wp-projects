import { Link, Text } from '@wpsocio/adapters';
import { FormField } from '@wpsocio/form';
import { __, sprintf } from '@wpsocio/i18n';
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
					sprintf(
						/* translators: 1 Plugin name */
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
					sprintf(
						/* translators: 1 profile page */
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
