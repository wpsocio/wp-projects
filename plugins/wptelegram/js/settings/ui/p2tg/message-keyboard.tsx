import { useWatch } from '@wpsocio/form';
import { __, sprintf } from '@wpsocio/i18n';
import { SectionCard } from '@wpsocio/shared-ui/components/section-card';
import { VariableButton } from '@wpsocio/shared-ui/components/variable-button';
import { FormField } from '@wpsocio/shared-ui/form/form-field';
import { FormItem } from '@wpsocio/shared-ui/form/form-item';
import { FormControl } from '@wpsocio/ui-components/ui/form.js';
import { Input } from '@wpsocio/ui-components/wrappers/input';
import { Switch } from '@wpsocio/ui-components/wrappers/switch';
import { createInterpolateElement } from '@wpsocio/utilities/createInterpolateElement';
import { getFieldLabel } from './../../services/fields';
import { Upsell } from './../shared/pro-upsell';
import { PREFIX } from './constants';

export const MessageKeyboard: React.FC = () => {
	const isDisabled = !useWatch({
		name: `${PREFIX}.inline_url_button` as const,
	});

	return (
		<SectionCard title={__('Inline Keyboard')}>
			<div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6 my-6">
				<div>
					<FormField
						name={`${PREFIX}.inline_url_button`}
						render={({ field }) => (
							<FormItem
								label={getFieldLabel('inline_url_button')}
								description={__(
									'Add an inline clickable button for the post URL just below the message.',
								)}
								className="flex-col"
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
				</div>
				<div>
					<FormField
						name={`${PREFIX}.inline_button_text`}
						render={({ field }) => (
							<FormItem
								label={getFieldLabel('inline_button_text')}
								className="flex-col"
								isDisabled={isDisabled}
							>
								<FormControl className="max-w-[200px]">
									<Input
										autoComplete="off"
										disabled={isDisabled}
										placeholder={__('View Post')}
										{...field}
									/>
								</FormControl>
							</FormItem>
						)}
					/>
				</div>
				<div>
					<FormField
						name={`${PREFIX}.inline_button_url`}
						render={({ field }) => (
							<FormItem
								label={getFieldLabel('inline_button_url')}
								description={__('Source of the button URL.')}
								className="flex-col"
								afterMessage={
									<p>
										{createInterpolateElement(
											sprintf(
												/* translators: template tag/macro */
												__('You can specify any custom field like %s.'),
												'<Macro />',
											),
											{
												Macro: <VariableButton content="{cf:_product_url}" />,
											},
										)}
									</p>
								}
								isDisabled={isDisabled}
							>
								<FormControl className="max-w-[200px]">
									<Input
										autoComplete="off"
										disabled={isDisabled}
										placeholder="{full_url}"
										{...field}
									/>
								</FormControl>
							</FormItem>
						)}
					/>
				</div>
			</div>
			<Upsell location="inline-button" />
		</SectionCard>
	);
};
