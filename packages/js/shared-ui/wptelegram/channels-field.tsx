import { useFieldArray, useFieldError, useFormContext } from '@wpsocio/form';
import { __ } from '@wpsocio/i18n';
import { Plus } from '@wpsocio/ui-components/icons/index.js';
import { Button } from '@wpsocio/ui-components/wrappers/button.js';
import {
	FormDescription,
	FormLabel,
	FormMessage,
} from '@wpsocio/ui-components/wrappers/form.js';
import { ChannelField, type ChannelFieldProps } from './channel-field.js';

export type ChannelsFieldProps = Pick<
	ChannelFieldProps,
	'bot_token' | 'placeholder' | 'aria-label' | 'showMemberCount'
> & {
	name: string;
	label: React.ReactNode;
	description?: React.ReactNode;
	addButtonLabel?: React.ReactNode;
};

export function ChannelsField({
	name,
	label,
	bot_token,
	description,
	placeholder,
	'aria-label': ariaLabel,
	showMemberCount,
	addButtonLabel,
}: ChannelsFieldProps) {
	const { control } = useFormContext();

	const { fields, append, remove } = useFieldArray({ name, control });

	const error = useFieldError(name);

	const errorMessage = error?.message || error?.root?.message;

	return (
		<div>
			<div>
				<FormLabel className="md:mt-2 md:basis-[30%]" isRequired>
					{label}
				</FormLabel>
				{description ? (
					<FormDescription className="mb-12">{description}</FormDescription>
				) : null}
				{errorMessage ? <FormMessage>{errorMessage}</FormMessage> : null}
				<div className="flex flex-col gap-10">
					{fields.map((field, index) => (
						<div key={field.id}>
							<ChannelField
								bot_token={bot_token}
								onRemove={() => remove(index)}
								name={`${name}.${index}.value`}
								placeholder={placeholder}
								aria-label={ariaLabel}
								showMemberCount={showMemberCount}
							/>
						</div>
					))}
				</div>
			</div>
			<Button
				onClick={() => append({ value: '' })}
				className="self-start mt-4"
				variant="secondary"
			>
				<Plus className="me-2" size="16" />
				{addButtonLabel || __('Add channel')}
			</Button>
		</div>
	);
}
