import { Box, type BoxProps } from '@wpsocio/adapters';

export interface SectionCardProps extends Omit<BoxProps, 'title'> {
	title: React.ReactNode;
	body?: React.ReactNode;
	headerProps?: BoxProps;
	bodyProps?: BoxProps;
}

export const SectionCard: React.FC<SectionCardProps> = ({
	body,
	children,
	title,
	headerProps,
	bodyProps,
	...rest
}) => {
	return (
		<Box border="1px" roundedTop="md" borderColor="gray.200" mb="2em" {...rest}>
			<Box px="1rem" py=".5rem" bgColor="#eaeaea" {...headerProps}>
				{title}
			</Box>
			<Box px="1.5rem" py="1rem" {...bodyProps}>
				{body || children}
			</Box>
		</Box>
	);
};
