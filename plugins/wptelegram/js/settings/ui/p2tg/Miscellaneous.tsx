import { Divider } from '@wpsocio/adapters';
import { SectionCard } from '@wpsocio/components';
import { __ } from '@wpsocio/i18n';

import {
	DelayInPosting,
	DisableNotification,
	P2TGSwitchAndPluginPosts,
	ProtectContent,
} from '@wpsocio/shared-wptelegram-ui';

import { useData } from '../../services';
import { Upsell } from '../shared/Upsell';
import { PREFIX } from './constants';

export const Miscellaneous: React.FC = () => {
	const { is_wp_cron_disabled } = useData('uiData');

	return (
		<SectionCard title={__('Miscellaneous')}>
			<P2TGSwitchAndPluginPosts prefix={PREFIX} />
			<Divider />
			<DelayInPosting
				prefix={PREFIX}
				is_wp_cron_disabled={is_wp_cron_disabled}
			/>
			<Upsell location="delay" />
			<Divider />
			<DisableNotification prefix={PREFIX} />
			<ProtectContent prefix={PREFIX} />
		</SectionCard>
	);
};
