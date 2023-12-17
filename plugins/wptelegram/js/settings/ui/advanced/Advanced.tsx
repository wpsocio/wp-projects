import { useEffect, useMemo } from 'react';

import { useFormContext, useWatch } from '@wpsocio/form';
import { __ } from '@wpsocio/i18n';

import { AdvancedSettings as SharedAdvancedSettings } from '@wpsocio/shared-wptelegram-ui';

import { useData } from '../../services';
import { PREFIX } from './constants';

export const Advanced: React.FC = () => {
	const { assets, uiData } = useData();
	const enable_logs = useWatch({ name: `${PREFIX}.enable_logs` });
	const { setValue } = useFormContext();

	useEffect(() => {
		if (enable_logs?.includes('p2tg') && !enable_logs?.includes('bot_api')) {
			setValue(`${PREFIX}.enable_logs`, [...enable_logs, 'bot_api']);
		}
	}, [enable_logs, setValue]);

	const log_options = useMemo(
		() => [
			{
				value: 'bot_api',
				label: __('Bot API'),
				viewLink: assets.botApiLogUrl || '',
				isDisabled: enable_logs?.includes('p2tg'),
			},
			{
				value: 'p2tg',
				label: __('Post to Telegram'),
				viewLink: assets.p2tgLogUrl || '',
			},
		],
		[assets, enable_logs],
	);

	return (
		<SharedAdvancedSettings
			prefix={PREFIX}
			log_options={log_options}
			debug_info={uiData?.debug_info || ''}
		/>
	);
};
