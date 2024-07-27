import { FormField, useWatch } from '@wpsocio/form';
import { useChatWithTest } from '@wpsocio/form-components';
import { __ } from '@wpsocio/i18n';

import { type DataShape, getFieldLabel } from '../../services';
import { PREFIX } from './constants';

export const Username: React.FC = () => {
	const bot_token = useWatch<DataShape, `${typeof PREFIX}.bot_token`>({
		name: `${PREFIX}.bot_token` as const,
	});

	const { button, memberCount, result, onBlur } = useChatWithTest(bot_token);
	return (
		<>
			<FormField
				addonBefore="@"
				after={
					<>
						{memberCount}
						{result}
					</>
				}
				button={button}
				description={__('Channel or group username.')}
				fieldType="text.button"
				label={getFieldLabel('username')}
				maxW="200px"
				name={`${PREFIX}.username`}
				placeholder="WPTelegram"
				onBlur={onBlur}
			/>
		</>
	);
};
