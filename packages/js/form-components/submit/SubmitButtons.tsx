import { ButtonGroup, type ButtonGroupProps, Divider } from '@wpsocio/adapters';

import './styles.scss';

export const SubmitButtons: React.FC<ButtonGroupProps> = ({
	children,
	...props
}) => {
	return (
		<>
			<Divider />
			<ButtonGroup
				spacing={4}
				px="1em"
				mt="1em"
				className="submit-buttons"
				{...props}
			>
				{children}
			</ButtonGroup>
		</>
	);
};
