import { pick } from 'ramda';

import { __ } from '@wpsocio/i18n';
import {
	Button,
	IconButton,
	ButtonProps,
	Popover,
	PopoverArrow,
	PopoverBody,
	PopoverContent,
	PopoverTrigger,
} from '@wpsocio/adapters';
import type { KeyboardButton as TKeyboardButton } from '@wpsocio/utilities';
import { ArrowUpIcon, EditIcon, DeleteIcon, CopyIcon } from '@wpsocio/icons';

interface ButtonRendererProps extends Partial<ButtonProps> {
	button: TKeyboardButton;
	hideActions?: boolean;
	isDisabled?: boolean;
	onEdit?: VoidFunction;
	onCopy?: VoidFunction;
	onDelete?: VoidFunction;
}

export const KeyboardButton: React.FC<ButtonRendererProps> = ({
	button,
	isDisabled,
	hideActions,
	onEdit,
	onCopy,
	onDelete,
	...rest
}) => {
	const title = Object.values(pick(['value', 'url', 'label'], button)).join(
		' | ',
	);
	const isUrlButton = Boolean(button.url);

	const output = (
		<Button
			title={title}
			mx="0.1em"
			flex="1 1 auto"
			background="#edf2f7"
			backgroundColor="rgba(164,164,165,.5)"
			{...rest}
		>
			{button.label}
			{isUrlButton && (
				<ArrowUpIcon
					transform="rotate(45deg)"
					position="absolute"
					insetEnd="0.1em"
					top="0.1em"
				/>
			)}
		</Button>
	);

	if (hideActions) {
		return output;
	}

	return (
		<Popover placement="top">
			<PopoverTrigger>{output}</PopoverTrigger>
			<PopoverContent width="auto">
				<PopoverArrow />
				<PopoverBody>
					<IconButton
						isDisabled={isDisabled}
						onClick={onEdit}
						icon={<EditIcon />}
						borderRadius={0}
						aria-label={__('Edit button')}
					/>
					<IconButton
						// isDisabled={isDisabled}
						onClick={onCopy}
						icon={<CopyIcon />}
						borderRadius={0}
						aria-label={__('Copy button')}
					/>
					<IconButton
						isDisabled={isDisabled}
						onClick={onDelete}
						icon={<DeleteIcon />}
						borderRadius={0}
						aria-label={__('Delete button')}
					/>
				</PopoverBody>
			</PopoverContent>
		</Popover>
	);
};
