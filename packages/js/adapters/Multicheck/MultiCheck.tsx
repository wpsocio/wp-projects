import { useMemo } from 'react';
import { Checkbox, CheckboxGroup, CheckboxGroupProps, Stack, StackProps } from '@chakra-ui/react';

import type { OptionsType } from '../types';

export interface MultiCheckProps extends CheckboxGroupProps {
	name?: string;
	options?: OptionsType;
	isInline?: boolean;
	ref?: any;
}

const dir: StackProps['direction'] = ['column', 'row'];

export const MultiCheck: React.FC<MultiCheckProps> = ({ children, options, isInline, ...restProps }) => {
	const childNodes = useMemo(() => {
		return options?.map(({ label, value, ...rest }, index) => {
			return (
				<Checkbox value={value} {...rest} key={`${value}${index}`}>
					{label}
				</Checkbox>
			);
		});
	}, [options]);

	// make sure the value is array
	const value = useMemo(
		() => (restProps.value === undefined ? restProps.value : restProps.value || []),
		[restProps.value]
	);

	const direction = isInline ? dir : 'column';

	return (
		<CheckboxGroup {...restProps} value={value}>
			<Stack direction={direction} spacing='0.5em'>
				{childNodes || children}
			</Stack>
		</CheckboxGroup>
	);
};
