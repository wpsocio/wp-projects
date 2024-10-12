import { __, sprintf } from '@wpsocio/i18n';
import { FormControl } from '@wpsocio/ui-components/ui/form.js';
import { Link } from '@wpsocio/ui-components/wrappers/link.jsx';
import { Switch } from '@wpsocio/ui-components/wrappers/switch.js';
import { createInterpolateElement } from '@wpsocio/utilities/createInterpolateElement.js';
import { prefixName } from '@wpsocio/utilities/misc.js';
import { FormField } from '../form/form-field.js';
import { FormItem } from '../form/form-item.js';
import { getFieldLabel } from './fields.js';
import type { CommonProps } from './types.js';

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
				name={prefixName('user_notifications', prefix)}
				render={({ field }) => (
					<FormItem
						description={__(
							'Allow users receive their email notifications on Telegram.',
						)}
						label={getFieldLabel('user_notifications')}
					>
						<FormControl>
							<Switch checked={field.value} onCheckedChange={field.onChange} />
						</FormControl>
					</FormItem>
				)}
			/>
			<p className="mb-8">
				<span>
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
				</span>
				<br />
				<span>
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
				</span>
			</p>
		</>
	);
};
