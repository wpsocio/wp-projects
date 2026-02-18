import { useWatch } from '@wpsocio/form';
import { __, sprintf } from '@wpsocio/i18n';
import { FormControl } from '@wpsocio/ui/components/form';
import { Alert } from '@wpsocio/ui/wrappers/alert';
import { Switch } from '@wpsocio/ui/wrappers/switch';
import { createInterpolateElement } from '@wpsocio/utilities/createInterpolateElement.js';
import { prefixName } from '@wpsocio/utilities/misc.js';
import { FormField } from '../form/form-field.js';
import { FormItem } from '../form/form-item.js';
import { getFieldLabel } from './fields.js';
import type { CommonProps } from './types.js';

export interface SingleMessageProps extends CommonProps {
	disabled?: boolean;
}

export const SingleMessage: React.FC<SingleMessageProps> = ({
	disabled,
	prefix,
}) => {
	const [link_preview_disabled, image_position, parse_mode, single_message] =
		useWatch({
			name: [
				prefixName('link_preview_disabled', prefix),
				prefixName('image_position', prefix),
				prefixName('parse_mode', prefix),
				prefixName('single_message', prefix),
			],
		});

	const showWarning =
		single_message &&
		image_position === 'after' &&
		(parse_mode === 'none' || link_preview_disabled);

	const warning = showWarning && (
		<Alert type="warning" title={__('Alert!')}>
			<div>
				<span>
					{createInterpolateElement(
						sprintf(
							/* translators: 1 - field name, 2 - value */
							__('When %1$s is set to %2$s:'),
							'<ImagePosition />',
							'<Value />',
						),
						{
							ImagePosition: <b>{getFieldLabel('image_position')}</b>,
							Value: <b>{__('After the Text')}</b>,
						},
					)}
				</span>
			</div>
			<ul className="list-disc ms-6">
				{parse_mode === 'none' && (
					<li className="text-destructive">
						{createInterpolateElement(
							sprintf(
								/* translators: 1 - field name, 2 - value */
								__('%1$s should not be %2$s.'),
								'<ParseMode />',
								'<Value />',
							),
							{
								ParseMode: <b>{getFieldLabel('parse_mode')}</b>,
								Value: <b>{__('None')}</b>,
							},
						)}
					</li>
				)}
				{link_preview_disabled && (
					<li className="text-destructive">
						{createInterpolateElement(
							sprintf(
								/* translators: 1 - field name */
								__('%s should not be enabled.'),
								'<DisablePreview />',
							),
							{
								DisablePreview: <b>{getFieldLabel('link_preview_disabled')}</b>,
							},
						)}
					</li>
				)}
			</ul>
		</Alert>
	);

	return (
		<FormField
			name={prefixName('single_message', prefix)}
			render={({ field }) => (
				<FormItem
					className="md:flex-col"
					description={__('Send both text and image in single message.')}
					label={getFieldLabel('single_message')}
					afterMessage={warning}
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
	);
};
