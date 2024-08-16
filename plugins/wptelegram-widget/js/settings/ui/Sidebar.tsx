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
					'Display the Telegram Public Channel or Group Feed in a WordPress widget or anywhere you want using a shortcode.',
				)}
				helpText={__('Join our public chat on Telegram')}
				reviewLink="https://wordpress.org/support/plugin/wptelegram-widget/reviews/#new-post"
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
