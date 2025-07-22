import { __ } from '@wpsocio/i18n';
import { SectionCard } from '@wpsocio/shared-ui/components/section-card';
import { DelayInPosting } from '@wpsocio/shared-ui/wptelegram/delay-in-posting.js';
import { DisableNotification } from '@wpsocio/shared-ui/wptelegram/disable-notification.js';
import { P2TGSwitchAndPluginPosts } from '@wpsocio/shared-ui/wptelegram/p2tg-switch-and-plugin-posts.js';
import { Separator } from '@wpsocio/ui/components/separator';
import { getDomData } from '../../services/getDomData';
import { Upsell } from '../shared/pro-upsell';
import { PREFIX } from './constants';

const { is_wp_cron_disabled, action_scheduler } = getDomData('uiData');

export const Miscellaneous: React.FC = () => {
	return (
		<SectionCard title={__('Miscellaneous')}>
			<P2TGSwitchAndPluginPosts prefix={PREFIX} />
			<Separator className="my-8 md:my-4" />
			<DelayInPosting
				prefix={PREFIX}
				is_wp_cron_disabled={is_wp_cron_disabled}
				is_action_scheduler_active={action_scheduler === 'active'}
			/>
			<Upsell location="delay" />
			<Separator className="my-8 md:my-4" />
			<DisableNotification prefix={PREFIX} />
		</SectionCard>
	);
};
