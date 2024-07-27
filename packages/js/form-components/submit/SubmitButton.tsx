import { Button, type ButtonProps } from '@wpsocio/adapters';
import { __ } from '@wpsocio/i18n';
import { SaveIcon } from '@wpsocio/icons';

export const SubmitButton: React.FC<ButtonProps> = (props) => {
	return (
		<Button
			variant="solid"
			colorScheme="blue"
			leftIcon={<SaveIcon boxSize="1.5rem" />}
			size="lg"
			type="submit"
			{...props}
		>
			{__('Save Changes')}
		</Button>
	);
};
