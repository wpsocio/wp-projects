import { Box, Flex } from '@wpsocio/adapters';

export interface VerticalDividerProps {
	height?: string;
}

export const VerticalDivider: React.FC<
	React.PropsWithChildren<VerticalDividerProps>
> = ({ children, height = '1em' }) => {
	const divider = (
		<Box
			width={0}
			height={height}
			borderLeft="1px solid"
			borderLeftColor="gray.300"
		/>
	);
	return (
		<Flex
			className="or"
			justifyContent="center"
			alignItems="center"
			flexDirection="column"
		>
			{divider}
			{children}
			{divider}
		</Flex>
	);
};
