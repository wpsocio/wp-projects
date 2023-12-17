import { Text } from '@wpsocio/adapters';
import { FormField } from '@wpsocio/form';
import { __ } from '@wpsocio/i18n';
import { prefixName } from '@wpsocio/utilities';

import { getFieldLabel } from '../services';
import type { CommonProps } from './types';

export interface DelayInPostingProps extends CommonProps {
	is_wp_cron_disabled?: boolean;
}

export const DelayInPosting: React.FC<DelayInPostingProps> = ({
	is_wp_cron_disabled,
	prefix,
}) => {
	return (
		<FormField
			name={prefixName('delay', prefix)}
			fieldType="number"
			label={getFieldLabel('delay')}
			info={__('The delay starts after the post gets published.')}
			after={
				<>
					&nbsp;{__('Minute(s)')}
					{is_wp_cron_disabled && (
						<>
							<br />
							<Text color="red.500">
								{__('WordPress cron should not be disabled!')}
							</Text>
						</>
					)}
				</>
			}
			display="inline-flex"
			valueAsNumber
			maxWidth="100px"
			min={0}
		/>
	);
};
