import { __ } from '@wpsocio/i18n';
import { Save } from '@wpsocio/ui-components/icons/index.js';
import {
	Button,
	type ButtonProps,
} from '@wpsocio/ui-components/wrappers/button.js';

export const SubmitButton: React.FC<ButtonProps> = (props) => {
	return (
		<Button size="lg" type="submit" {...props}>
			<Save size={18} className="me-2" />
			{__('Save Changes')}
		</Button>
	);
};
