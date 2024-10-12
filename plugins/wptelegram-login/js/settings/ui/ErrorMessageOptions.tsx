import { useFormContext, useWatch } from '@wpsocio/form';
import { __ } from '@wpsocio/i18n';
import { SectionCard } from '@wpsocio/shared-ui/components/section-card.js';
import { FormItem } from '@wpsocio/shared-ui/form/form-item';
import { cn } from '@wpsocio/ui-components';
import {
	FormControl,
	FormField,
} from '@wpsocio/ui-components/wrappers/form.js';
import { Input } from '@wpsocio/ui-components/wrappers/input';
import { Switch } from '@wpsocio/ui-components/wrappers/switch';
import { getFieldLabel } from '../services';

export const ErrorMessageOptions = () => {
	const { control } = useFormContext();
	const show_message_on_error = useWatch({
		name: 'show_message_on_error',
	});

	return (
		<SectionCard title={__('Error Message')}>
			<div className="flex flex-col gap-10 md:gap-4">
				<FormField
					control={control}
					name="show_message_on_error"
					render={({ field }) => (
						<FormItem
							label={getFieldLabel('show_message_on_error')}
							description={__(
								"Display an error message if Telegram is blocked by user's ISP.",
							)}
						>
							<FormControl>
								<Switch
									{...field}
									value={undefined}
									checked={field.value}
									onCheckedChange={field.onChange}
								/>
							</FormControl>
						</FormItem>
					)}
				/>

				<FormField
					control={control}
					name="custom_error_message"
					render={({ field }) => (
						<FormItem
							label={getFieldLabel('custom_error_message')}
							description={__('Leave empty for default.')}
							className={cn({
								'!hidden': !show_message_on_error,
							})}
						>
							<FormControl>
								<Input {...field} />
							</FormControl>
						</FormItem>
					)}
				/>
			</div>
		</SectionCard>
	);
};
