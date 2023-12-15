import { Box } from '@wpsocio/adapters';
import { PluginInfoCard, WPTGSocialIcons } from '@wpsocio/components';
import { FormDebug } from '@wpsocio/form';
import { __ } from '@wpsocio/i18n';

import { useData } from '../services';

import { WidgetInfoCard } from './WidgetInfoCard';

export const Sidebar: React.FC = () => {
	const {
		pluginInfo: { title },
		assets: { tgIconUrl },
	} = useData();
	return (
		<Box>
			<PluginInfoCard
				description={__(
					'Let the users login to your WordPress website with their Telegram and make it simple for them to get connected and let them receive their email notifications on Telegram.',
				)}
				helpText={__('Get LIVE support on Telegram')}
				reviewLink="https://wordpress.org/support/plugin/wptelegram-login/reviews/#new-post"
				supportLink="https://t.me/WPTelegramChat"
				supportLinkText="@WPTelegramChat"
				socialIcons={<WPTGSocialIcons tgIconUrl={tgIconUrl} />}
				title={title}
			/>
			<WidgetInfoCard />
			<FormDebug />
		</Box>
	);
};
