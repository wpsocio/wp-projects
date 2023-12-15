import {
	Input,
	InputAddonProps,
	InputGroup,
	InputGroupProps,
	InputLeftAddon,
	InputProps,
	InputRightAddon,
} from '@chakra-ui/react';
import { forwardRef } from 'react';

export interface TextInputProps extends InputProps {
	addonBefore?: React.ReactNode;
	addonAfter?: React.ReactNode;
	addonBeforeProps?: InputAddonProps;
	addonAfterProps?: InputAddonProps;
	wrapperProps?: InputGroupProps;
}

export const TextInput = forwardRef<HTMLInputElement, TextInputProps>(
	(
		{
			addonBefore,
			addonAfter,
			addonBeforeProps,
			addonAfterProps,
			wrapperProps,
			...rest
		},
		ref,
	) => {
		return (
			<InputGroup {...wrapperProps}>
				{addonBefore && (
					<InputLeftAddon {...addonBeforeProps}>{addonBefore}</InputLeftAddon>
				)}
				<Input {...rest} ref={ref} />
				{addonAfter && (
					<InputRightAddon {...addonAfterProps}>{addonAfter}</InputRightAddon>
				)}
			</InputGroup>
		);
	},
);
