import { useWatch } from '@wpsocio/form';
import { __, sprintf } from '@wpsocio/i18n';
import { FormControl } from '@wpsocio/ui/components/form';
import { Input } from '@wpsocio/ui/wrappers/input';
import { Switch } from '@wpsocio/ui/wrappers/switch';
import createInterpolateElement from '@wpsocio/utilities/createInterpolateElement.js';
import { prefixName } from '@wpsocio/utilities/misc.js';
import { VariableButton } from '../components/variable-button.jsx';
import { FormField } from '../form/form-field.js';
import { FormItem } from '../form/form-item.js';
import { getFieldLabel } from './fields.js';
import type { CommonProps } from './types.js';

export type LinkPreviewOptionsProps = CommonProps & {
	disabled?: boolean;
	disabledReason?: React.ReactNode;
};

export const LinkPreviewOptions: React.FC<LinkPreviewOptionsProps> = ({
	prefix,
	disabled = false,
	disabledReason,
}) => {
	const link_preview_disabled = useWatch({
		name: prefixName('link_preview_disabled', prefix),
	});
	const areDependentFieldsDisabled = disabled || link_preview_disabled;

	return (
		<div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6 md:gap-2 my-6">
			<div>
				<FormField
					name={prefixName('link_preview_disabled', prefix)}
					render={({ field }) => (
						<FormItem
							className="md:flex-col"
							label={getFieldLabel('link_preview_disabled')}
							description={
								<>
									{__('Disables previews for links in the messages.')}
									{disabled && disabledReason ? (
										<span className="block text-destructive">
											{disabledReason}
										</span>
									) : null}
								</>
							}
							isDisabled={disabled}
						>
							<FormControl>
								<Switch
									{...field}
									value={undefined}
									checked={field.value}
									onCheckedChange={field.onChange}
									disabled={disabled}
									aria-readonly={disabled}
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
							className="md:flex-col"
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
												'<Macro />',
											),
											{
												Macro: <VariableButton content="{full_url}" />,
											},
										)}
									</span>
								</>
							}
							isDisabled={areDependentFieldsDisabled}
						>
							<FormControl className="max-w-[200px]">
								<Input
									autoComplete="off"
									disabled={areDependentFieldsDisabled}
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
							className="md:flex-col"
							label={getFieldLabel('link_preview_above_text')}
							description={__(
								'Whether the link preview must be shown above the message text.',
							)}
							isDisabled={areDependentFieldsDisabled}
						>
							<FormControl>
								<Switch
									{...field}
									value={undefined}
									checked={field.value}
									onCheckedChange={field.onChange}
									disabled={areDependentFieldsDisabled}
									aria-readonly={areDependentFieldsDisabled}
								/>
							</FormControl>
						</FormItem>
					)}
				/>
			</div>
		</div>
	);
};
