import { type BoxProps, StackItem } from '@wpsocio/adapters';

export const FeildStackItem: React.FC<BoxProps> = ({ children, ...props }) => {
	return (
		<StackItem flexBasis="31%" {...props}>
			{children}
		</StackItem>
	);
};
