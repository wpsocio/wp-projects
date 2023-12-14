import { forwardRef } from 'react';
import {
	NumberDecrementStepper,
	NumberIncrementStepper,
	NumberInput as ChakraNumberInput,
	NumberInputProps as ChakraNumberInputProps,
	NumberInputField,
	NumberInputStepper,
} from '@chakra-ui/react';

export interface NumberInputProps
	extends Omit<ChakraNumberInputProps, 'onChange'> {
	// fix the mess created by react-hook-form and chakra
	onChange?: React.ChangeEventHandler<HTMLInputElement>;
	onChangeValue?: (valueAsString: string, valueAsNumber: number) => void;
}

export const NumberInput = forwardRef<HTMLInputElement, NumberInputProps>(
	({ onChange, onChangeValue, ...props }, ref) => {
		return (
			<ChakraNumberInput {...props} onChange={onChangeValue}>
				<NumberInputField onChange={onChange} ref={ref} />
				<NumberInputStepper>
					<NumberIncrementStepper />
					<NumberDecrementStepper />
				</NumberInputStepper>
			</ChakraNumberInput>
		);
	},
);
