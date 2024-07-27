import { Button, type ButtonProps } from '@wpsocio/adapters';

export const ResetButton: React.FC<ButtonProps> = (props) => {
	return <Button size="lg" type="reset" {...props} />;
};
