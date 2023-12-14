import { Text, TextProps } from '@wpsocio/adapters';

export const Description: React.FC<TextProps> = ({ children, ...props }) => {
	return (
		<Text as="p" fontStyle="italic" className="description" {...props}>
			{children}
		</Text>
	);
};
