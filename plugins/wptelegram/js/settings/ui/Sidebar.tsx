import { Box } from '@wpsocio/adapters';
import { PluginInfoCard, WPTGSocialIcons } from '@wpsocio/components';
import { FormDebug } from '@wpsocio/form';
import { __ } from '@wpsocio/i18n';
import { isDev } from '@wpsocio/utilities';

import { useData } from '../services';
import { Upsell } from './shared/Upsell';

const Sidebar: React.FC = () => {
	const { pluginInfo, assets } = useData();

	return (
		<Box>
			<PluginInfoCard
				description={__(
					'Integrate your WordPress website perfectly with Telegram. Send posts automatically to Telegram when published or updated, whether to a Telegram Channel, Group or private chat, with full control. Get your email notifications on Telegram.',
				)}
				helpText={__('Join our public chat on Telegram')}
				reviewLink="https://wordpress.org/support/plugin/wptelegram/reviews/#new-post"
				supportLink="https://t.me/WPTelegramChat"
				supportLinkText="@WPTelegramChat"
				socialIcons={<WPTGSocialIcons tgIconUrl={assets.tgIconUrl} />}
				title={pluginInfo.title}
				upsell={<Upsell breakLine location="sidebar" fontWeight="normal" />}
			/>
			{isDev && <FormDebug debug={true} />}
		</Box>
	);
};

export default Sidebar;
