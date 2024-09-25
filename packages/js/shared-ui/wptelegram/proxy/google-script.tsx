import { __ } from '@wpsocio/i18n';
import { FormControl } from '@wpsocio/ui-components/ui/form.js';
import { Input } from '@wpsocio/ui-components/wrappers/input.jsx';
import { prefixName } from '@wpsocio/utilities/misc.js';
import { InstructionsLink } from '../../components/instructions-link.jsx';
import { FormField } from '../../form/form-field.js';
import { FormItem } from '../../form/form-item.js';
import { getFieldLabel } from '../fields.js';
import type { CommonProps } from '../types.js';

export const GoogleScript: React.FC<CommonProps> = ({ prefix }) => {
	return (
		<FormField
			name={prefixName('google_script_url', prefix)}
			render={({ field }) => (
				<FormItem
					description={__(
						'The requests to Telegram will be sent via this URL.',
					)}
					label={getFieldLabel('google_script_url')}
					afterMessage={
						<InstructionsLink link="https://gist.github.com/manzoorwanijk/ee9ed032caedf2bb0c83dea73bc9a28e#how-to-deploy" />
					}
				>
					<FormControl className="max-w-[700px]">
						<Input
							autoComplete="off"
							placeholder="https://script.google.com/macros/s/XxXxXxXxXxXxXxX/exec"
							type="url"
							{...field}
						/>
					</FormControl>
				</FormItem>
			)}
		/>
	);
};
