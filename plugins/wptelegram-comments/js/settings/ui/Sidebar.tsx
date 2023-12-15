import { Box } from '@wpsocio/adapters';
import { PluginInfoCard, WPTGSocialIcons } from '@wpsocio/components';
import { FormDebug } from '@wpsocio/form';
import { __ } from '@wpsocio/i18n';

import { useData } from '../services';

const Sidebar: React.FC = () => {
	const {
		pluginInfo: { title },
		assets: { tgIconUrl },
	} = useData();

	return (
		<Box>
			<PluginInfoCard
				description={__(
					'Use Telegram Comments widget for your WordPress posts or pages.',
				)}
				helpText={__('Get LIVE support on Telegram')}
				reviewLink="https://wordpress.org/support/plugin/wptelegram-comments/reviews/#new-post"
				supportLink="https://t.me/WPTelegramChat"
				supportLinkText="@WPTelegramChat"
				socialIcons={<WPTGSocialIcons tgIconUrl={tgIconUrl} />}
				title={title}
			/>
			<FormDebug />
		</Box>
	);
};

export default Sidebar;
