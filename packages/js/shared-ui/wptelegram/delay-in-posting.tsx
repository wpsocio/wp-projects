import { useWatch } from '@wpsocio/form';
import { __, sprintf } from '@wpsocio/i18n';
import { FormControl } from '@wpsocio/ui/components/form';
import { Warning } from '@wpsocio/ui/icons';
import { Alert } from '@wpsocio/ui/wrappers/alert';
import { Input } from '@wpsocio/ui/wrappers/input';
import { Link } from '@wpsocio/ui/wrappers/link';
import createInterpolateElement from '@wpsocio/utilities/createInterpolateElement.js';
import { prefixName } from '@wpsocio/utilities/misc.js';
import { FormField } from '../form/form-field.js';
import { FormItem } from '../form/form-item.js';
import { getFieldLabel } from './fields.js';
import type { CommonProps } from './types.js';

export interface DelayInPostingProps extends CommonProps {
	is_wp_cron_disabled?: boolean;
	is_action_scheduler_active?: boolean;
}

export const DelayInPosting: React.FC<DelayInPostingProps> = ({
	is_wp_cron_disabled,
	is_action_scheduler_active,
	prefix,
}) => {
	const delay = Number(useWatch({ name: prefixName('delay', prefix) }));

	return (
		<>
			<FormField
				name={prefixName('delay', prefix)}
				render={({ field }) => (
					<FormItem
						label={getFieldLabel('delay')}
						description={
							<>
								{__('The delay starts after the post gets published.')}
								&nbsp;
								{!is_action_scheduler_active &&
									createInterpolateElement(
										sprintf(
											/* translators: %s is the plugin name */
											__(
												'If you face any issues with delay in posting, please install the %s plugin.',
											),
											'<link />',
										),
										{
											link: (
												<Link
													href="https://wordpress.org/plugins/action-scheduler/"
													isExternal
												>
													{'Action Scheduler'}
												</Link>
											),
										},
									)}
							</>
						}
					>
						<FormControl className="max-w-[100px]">
							<Input type="number" max={300} min={0} step="any" {...field} />
						</FormControl>
						&nbsp;{__('Minute(s)')}
					</FormItem>
				)}
			/>
			{is_wp_cron_disabled && delay && !is_action_scheduler_active ? (
				<Alert
					type="error"
					title={__('Warning')}
					className="max-w-max mt-4 md:mt-0"
					icon={<Warning size="16" />}
				>
					{__('WordPress cron should not be disabled!')}
					&nbsp;
					{createInterpolateElement(
						sprintf(
							/* translators: %s is the plugin name */
							__('Otherwise, you may install the %s plugin.'),
							'<link />',
						),
						{
							link: (
								<Link
									href="https://wordpress.org/plugins/action-scheduler/"
									isExternal
								>
									{'Action Scheduler'}
								</Link>
							),
						},
					)}
				</Alert>
			) : null}
		</>
	);
};
