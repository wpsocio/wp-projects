import { Box, Collapse } from '@wpsocio/adapters';
import { useWatch } from '@wpsocio/form';

export type IfActiveProps = {
	name: string;
} & (
	| { children: (isActive: boolean) => React.ReactNode }
	| { children: React.ReactNode }
);

export const IfActive: React.FC<IfActiveProps> = ({ children, name }) => {
	const active: boolean = useWatch({ name });

	return (
		// There is some bug in Collapse component and it doesn't collapse/expand properly
		<>
			{/* <Collapse in={active}> */}
			<Box height={active ? 'auto' : 0} overflow="hidden">
				{'function' === typeof children ? children(active) : children}
			</Box>
			{/* </Collapse> */}
		</>
	);
};
