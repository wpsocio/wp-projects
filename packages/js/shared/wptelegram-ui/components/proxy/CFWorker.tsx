import { __ } from '@wpsocio/i18n';
import { FormField } from '@wpsocio/form';
import { InstructionsLink } from '@wpsocio/components';

import { getFieldLabel } from '../../services';
import type { CommonProps } from '../types';

export const CFWorker: React.FC<CommonProps> = ({ prefix }) => {
	return (
		<FormField
			name={`${prefix}.cf_worker_url`}
			fieldType="text"
			type="url"
			description={__('The requests to Telegram will be sent via this URL.')}
			label={getFieldLabel('cf_worker_url')}
			placeholder="https://my-worker.mysubdomain.workers.dev"
			maxWidth="700px"
			after={
				<InstructionsLink link="https://github.com/manzoorwanijk/telegram-bot-api-worker#how-to-deploy" />
			}
		/>
	);
};
