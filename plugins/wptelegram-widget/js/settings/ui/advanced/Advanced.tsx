import { useFormContext, useWatch } from '@wpsocio/form';
import { __ } from '@wpsocio/i18n';
import { FormItem } from '@wpsocio/shared-ui/form/form-item';
import {
	FormControl,
	FormField,
} from '@wpsocio/ui-components/wrappers/form.js';
import { Input } from '@wpsocio/ui-components/wrappers/input.js';
import { Link } from '@wpsocio/ui-components/wrappers/link';
import { Switch } from '@wpsocio/ui-components/wrappers/switch';
import { type DataShape, getFieldLabel } from '../../services';

const prefix = 'advanced' as const;

export const Advanced: React.FC = () => {
	const { control } = useFormContext<DataShape>();

	const telegram_blocked = useWatch<
		DataShape,
		`${typeof prefix}.telegram_blocked`
	>({
		name: `${prefix}.telegram_blocked`,
	});

	return (
		<div className="flex flex-col gap-10 md:gap-4">
			<FormField
				control={control}
				name={`${prefix}.telegram_blocked`}
				render={({ field }) => (
					<FormItem
						label={getFieldLabel('telegram_blocked')}
						description={__('Whether your host blocks Telegram.')}
					>
						<FormControl>
							<Switch
								{...field}
								value={field.value?.toString()}
								checked={field.value}
								onCheckedChange={field.onChange}
							/>
						</FormControl>
					</FormItem>
				)}
			/>

			{telegram_blocked ? (
				<FormField
					control={control}
					name={`${prefix}.google_script_url`}
					render={({ field }) => (
						<FormItem
							label={getFieldLabel('google_script_url')}
							description={__(
								'The requests to Telegram will be sent via your Google Script.',
							)}
							isRequired
							afterMessage={
								<Link
									href="https://gist.github.com/manzoorwanijk/7b1786ad69826d1a7acf20b8be83c5aa#how-to-deploy"
									isExternal
								>
									{__('See this tutorial')}
								</Link>
							}
						>
							<FormControl>
								<Input required {...field} type="url" />
							</FormControl>
						</FormItem>
					)}
				/>
			) : null}
		</div>
	);
};
