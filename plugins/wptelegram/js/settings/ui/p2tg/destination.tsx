import { useWatch } from '@wpsocio/form';
import { __ } from '@wpsocio/i18n';
import { SectionCard } from '@wpsocio/shared-ui/components/section-card.js';
import { ChannelsField } from '@wpsocio/shared-ui/wptelegram/channels-field.js';
import { type DataShape, getFieldLabel } from '../../services/fields.js';
import { Upsell } from '../shared/pro-upsell.js';
import { PREFIX } from './constants';

export const Destination: React.FC = () => {
	const bot_token = useWatch<DataShape, 'bot_token'>({ name: 'bot_token' });

	return (
		<SectionCard title={__('Destination')}>
			<ChannelsField
				name={`${PREFIX}.channels`}
				label={getFieldLabel('channels')}
				bot_token={bot_token}
				description={__('Channel or group username.')}
			/>
			<Upsell location="channels" />
		</SectionCard>
	);
};
