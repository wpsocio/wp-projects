import {
	Select as ChakraSelect,
	SelectProps as ChakraSelectProps,
} from '@chakra-ui/react';
import { forwardRef, useMemo } from 'react';
import type { OptionsType } from '../types';

export interface SelectProps extends ChakraSelectProps {
	options?: OptionsType<string>;
}

const rootProps = { maxW: 'max-content' };

export const Select = forwardRef<HTMLSelectElement, SelectProps>(
	({ options, children, ...selectProps }, ref) => {
		const childNodes = useMemo<React.ReactNode>(() => {
			return options?.map(
				({ label, options: optionGroups, value, ...optionProps }, index) => {
					if (optionGroups?.length && label) {
						return (
							<optgroup
								label={label as string}
								key={`${label}${index}`}
								{...optionProps}
							>
								{optionGroups.map(
									({ label: optLabel, value, ...optProps }, i) => (
										<option {...optProps} value={value} key={`${value}${i}`}>
											{optLabel}
										</option>
									),
								)}
							</optgroup>
						);
					}
					return (
						<option {...optionProps} value={value} key={`${value}${index}`}>
							{label}
						</option>
					);
				},
			);
		}, [options]);

		return (
			<ChakraSelect rootProps={rootProps} ref={ref} {...selectProps}>
				{childNodes || children}
			</ChakraSelect>
		);
	},
);
