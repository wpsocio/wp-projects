import { useWatch } from '@wpsocio/form';
import { __, sprintf } from '@wpsocio/i18n';
import { FormControl } from '@wpsocio/ui-components/ui/form.js';
import { Input } from '@wpsocio/ui-components/wrappers/input.js';
import { Switch } from '@wpsocio/ui-components/wrappers/switch.js';
import createInterpolateElement from '@wpsocio/utilities/createInterpolateElement.js';
import { prefixName } from '@wpsocio/utilities/misc.js';
import { VariableButton } from '../components/variable-button.jsx';
import { FormField } from '../form/form-field.js';
import { FormItem } from '../form/form-item.js';
import { getFieldLabel } from './fields.js';
import type { CommonProps } from './types.js';

export const LinkPreviewOptions: React.FC<CommonProps> = ({ prefix }) => {
	const link_preview_disabled = useWatch({
		name: prefixName('link_preview_disabled', prefix),
	});

	return (
		<div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6 md:gap-2 my-6">
			<div>
				<FormField
					name={prefixName('link_preview_disabled', prefix)}
					render={({ field }) => (
						<FormItem
							className="flex-col"
							label={getFieldLabel('link_preview_disabled')}
							description={__('Disables previews for links in the messages.')}
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
			</div>
			<div>
				<FormField
					name={prefixName('link_preview_url', prefix)}
					render={({ field }) => (
						<FormItem
							className="flex-col"
							label={getFieldLabel('link_preview_url')}
							description={
								<>
									{__('URL to use for the link preview.')}
									&nbsp;
									<span>
										{createInterpolateElement(
											sprintf(
												/* translators: %s code example */
												__('For example %s'),
												'<Ex />',
											),
											{
												Ex: <VariableButton content="{full_url}" />,
											},
										)}
									</span>
								</>
							}
						>
							<FormControl className="max-w-[200px]">
								<Input
									autoComplete="off"
									disabled={link_preview_disabled}
									placeholder="{full_url}"
									{...field}
								/>
							</FormControl>
						</FormItem>
					)}
				/>
			</div>
			<div>
				<FormField
					name={prefixName('link_preview_above_text', prefix)}
					render={({ field }) => (
						<FormItem
							className="flex-col"
							label={getFieldLabel('link_preview_above_text')}
							description={__(
								'Whether the link preview must be shown above the message text.',
							)}
						>
							<FormControl>
								<Switch
									{...field}
									value={field.value?.toString()}
									checked={field.value}
									onCheckedChange={field.onChange}
									disabled={link_preview_disabled}
								/>
							</FormControl>
						</FormItem>
					)}
				/>
			</div>
		</div>
	);
};
