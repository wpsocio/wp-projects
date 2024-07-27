import { Box, type BoxProps, Flex } from '@wpsocio/adapters';
import { useMemo } from 'react';

const commonColumnProps: BoxProps = {
	borderWidth: '1px',
	borderColor: 'gray.200',
	borderRadius: '0.1rem',
};

const baseColumnWidth: BoxProps['maxW'] = ['100%', '100%', '100%'];

export interface ColumnsProps extends BoxProps {
	addBorders?: boolean;
	leftCol: React.ReactNode;
	rightCol: React.ReactNode;
	leftColWidth?: string;
	rightColWidth?: string;
}

export const Columns: React.FC<ColumnsProps> = ({
	addBorders,
	children,
	leftCol,
	leftColWidth = '50%',
	rightCol,
	rightColWidth = '50%',
	...rest
}) => {
	const flexBasisFirst = useMemo(
		() => [...baseColumnWidth, leftColWidth],
		[leftColWidth],
	);
	const flexBasisSecond = useMemo(
		() => [...baseColumnWidth, rightColWidth],
		[rightColWidth],
	);

	return (
		<Flex flexWrap="wrap" mt="1em" {...rest}>
			<Box flexBasis={flexBasisFirst} maxW={flexBasisFirst} px="0.4rem">
				<Box {...(addBorders && commonColumnProps)} mb="1rem" background="#fff">
					{leftCol}
				</Box>
			</Box>
			<Box flexBasis={flexBasisSecond} maxW={flexBasisSecond} px="0.4rem">
				<Box {...(addBorders && commonColumnProps)} mb="1rem" background="#fff">
					{rightCol}
				</Box>
			</Box>
			{children}
		</Flex>
	);
};
