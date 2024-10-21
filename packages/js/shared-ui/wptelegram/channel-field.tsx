import { useFieldError, useWatch } from '@wpsocio/form';
import { __ } from '@wpsocio/i18n';
import { Close } from '@wpsocio/ui-components/icons/index.js';
import { IconButton } from '@wpsocio/ui-components/wrappers/icon-button.js';
import {
	Input,
	type InputProps,
} from '@wpsocio/ui-components/wrappers/input.js';
import { FormField } from '../form/form-field.js';
import { useChatWithTest } from '../form/use-chat-with-test.js';

export type ChannelFieldProps = InputProps & {
	bot_token: string;
	onRemove: VoidFunction;
	name: string;
	showMemberCount?: boolean;
};

export function ChannelField({
	bot_token,
	onRemove,
	name,
	placeholder = '@username',
	'aria-label': ariaLabel,
	showMemberCount = true,
}: ChannelFieldProps) {
	const { ButtonComponent, memberCount, result, onBlur } =
		useChatWithTest(bot_token);

	const chat_id = useWatch({ name });
	const error = useFieldError(name);

	return (
		<FormField
			name={name}
			render={({ field }) => (
				<div>
					<div className="flex gap-3 items-center flex-row border p-2 rounded max-w-[35rem]">
						<div className="grid grid-cols-1 gap-2 sm:grid-cols-3 w-full">
							<Input
								type="text"
								aria-label={ariaLabel || __('Channel username or Chat ID')}
								placeholder={placeholder}
								className="sm:col-span-2"
								isInvalid={!!error}
								{...field}
								onBlur={(e) => {
									if (showMemberCount) {
										onBlur?.(e);
									}
									field.onBlur?.();
								}}
							/>
							<ButtonComponent chat_id={chat_id} />
						</div>
						<IconButton
							variant="ghost"
							aria-label={__('Remove')}
							icon={<Close />}
							onClick={onRemove}
							className="rounded-full"
						/>
					</div>
					<div>
						{memberCount}
						{result}
					</div>
				</div>
			)}
		/>
	);
}
