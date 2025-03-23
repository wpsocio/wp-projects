import {
	Button,
	type ButtonProps,
} from '@wpsocio/ui/wrappers/button';

export const ResetButton: React.FC<ButtonProps> = (props) => {
	return <Button size="lg" type="reset" {...props} />;
};
