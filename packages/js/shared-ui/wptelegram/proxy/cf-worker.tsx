import { __ } from '@wpsocio/i18n';
import { FormControl } from '@wpsocio/ui/components/form';
import { Input } from '@wpsocio/ui/wrappers/input';
import { prefixName } from '@wpsocio/utilities/misc.js';
import { InstructionsLink } from '../../components/instructions-link.js';
import { FormField } from '../../form/form-field.js';
import { FormItem } from '../../form/form-item.js';
import { getFieldLabel } from '../fields.js';
import type { CommonProps } from '../types.js';

export const CFWorker: React.FC<CommonProps> = ({ prefix }) => {
	return (
		<FormField
			name={prefixName('cf_worker_url', prefix)}
			render={({ field }) => (
				<FormItem
					description={__(
						'The requests to Telegram will be sent via this URL.',
					)}
					label={getFieldLabel('cf_worker_url')}
					afterMessage={
						<InstructionsLink link="https://github.com/manzoorwanijk/telegram-bot-api-worker#how-to-deploy" />
					}
				>
					<FormControl className="max-w-[700px]">
						<Input
							autoComplete="off"
							placeholder="https://my-worker.mysubdomain.workers.dev"
							type="url"
							{...field}
						/>
					</FormControl>
				</FormItem>
			)}
		/>
	);
};
