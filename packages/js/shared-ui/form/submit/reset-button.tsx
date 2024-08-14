import {
	Button,
	type ButtonProps,
} from '@wpsocio/ui-components/wrappers/button.js';

export const ResetButton: React.FC<ButtonProps> = (props) => {
	return <Button size="lg" type="reset" {...props} />;
};
