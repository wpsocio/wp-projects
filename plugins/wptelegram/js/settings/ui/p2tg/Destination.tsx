import { Stack, StackItem, type StackProps } from '@wpsocio/adapters';
import { SectionCard } from '@wpsocio/components';
import { FormField, useWatch } from '@wpsocio/form';
import { useChatWithTest } from '@wpsocio/form-components';
import { __ } from '@wpsocio/i18n';

import { type DataShape, getFieldLabel } from '../../services';
import { Upsell } from '../shared/Upsell';
import { PREFIX } from './constants';

const direction: StackProps['direction'] = { base: 'column', '2xl': 'row' };

export const Destination: React.FC = () => {
	const bot_token = useWatch<DataShape, 'bot_token'>({ name: 'bot_token' });

	const { button, memberCount, result, onBlur } = useChatWithTest(bot_token);

	return (
		<SectionCard title={__('Destination')}>
			<Stack spacing={8} direction={direction} flexWrap="wrap">
				<StackItem flex={1} maxWidth="600px">
					<FormField
						button={button}
						description={__('Channel Username or Chat ID.')}
						fieldType="text.button"
						isRepeatable
						label={getFieldLabel('channels')}
						name={`${PREFIX}.channels`}
						onBlur={onBlur}
						placeholder="@username"
					/>
				</StackItem>
				<StackItem flex={1}>
					{memberCount}
					{result}
				</StackItem>
			</Stack>
			<Upsell location="channels" textAlign="center" />
		</SectionCard>
	);
};
