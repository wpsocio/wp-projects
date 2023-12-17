import { __ } from '@wpsocio/i18n';
import { FormField } from '@wpsocio/form';
import { InstructionsLink } from '@wpsocio/components';
import { prefixName } from '@wpsocio/utilities';

import { getFieldLabel } from '../../services';
import type { CommonProps } from '../types';

export const GoogleScript: React.FC<CommonProps> = ({ prefix }) => {
	return (
		<>
			<FormField
				name={prefixName('google_script_url', prefix)}
				fieldType="text"
				type="url"
				description={__('The requests to Telegram will be sent via this URL.')}
				label={getFieldLabel('google_script_url')}
				placeholder="https://script.google.com/macros/s/XxXxXxXxXxXxXxX/exec"
				maxWidth="700px"
				after={
					<InstructionsLink link="https://gist.github.com/manzoorwanijk/ee9ed032caedf2bb0c83dea73bc9a28e#how-to-deploy" />
				}
			/>
		</>
	);
};
