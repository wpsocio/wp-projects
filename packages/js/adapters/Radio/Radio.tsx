import {
	type RadioGroupProps as ChakraRadioProps,
	Radio as CharaRadio,
	RadioGroup,
	Stack,
	type StackProps,
} from '@chakra-ui/react';
import { forwardRef, useMemo } from 'react';

import type { OptionsType } from '../types';

export interface RadioProps extends Partial<ChakraRadioProps> {
	options?: OptionsType;
	isInline?: boolean;
	isDisabled?: boolean;
}

const dir: StackProps['direction'] = ['column', 'row'];

export const Radio = forwardRef<HTMLInputElement, RadioProps>(
	({ children, options, isDisabled, isInline, name, ...restProps }, ref) => {
		const childNodes = useMemo(() => {
			return options?.map(({ label, value, ...rest }, index) => {
				const key = `${name}-${value}-${index}`;
				return (
					<CharaRadio
						id={key}
						{...rest}
						value={value?.toString() || ''}
						key={key}
					>
						{label}
					</CharaRadio>
				);
			});
		}, [name, options]);

		const direction = isInline ? dir : 'column';

		return (
			<RadioGroup {...restProps} disabled={isDisabled} name={name} ref={ref}>
				<Stack direction={direction} spacing="1em">
					{childNodes || children}
				</Stack>
			</RadioGroup>
		);
	},
);
