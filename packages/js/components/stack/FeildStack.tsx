import { Stack, type StackProps } from '@wpsocio/adapters';

const direction: StackProps['direction'] = ['column', 'row'];

export const FeildStack: React.FC<React.PropsWithChildren<unknown>> = ({
	children,
}) => {
	return (
		<Stack
			direction={direction}
			flexWrap="wrap"
			justifyContent="space-between"
			spacing="1em"
		>
			{children}
		</Stack>
	);
};
