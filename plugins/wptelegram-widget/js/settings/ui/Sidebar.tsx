import { useFormContext } from '@wpsocio/form';
import { __ } from '@wpsocio/i18n';
import { PluginInfoCard } from '@wpsocio/shared-ui/components/plugin-info/plugin-info-card.js';
import { WPTGSocialIcons } from '@wpsocio/shared-ui/components/wptg-social-icons.js';
import { FormDebug } from '@wpsocio/shared-ui/form/form-debug';
import { getDomData } from '../services';

const {
	pluginInfo: { title },
	assets: { tgIconUrl },
} = getDomData();

const Sidebar: React.FC = () => {
	const { watch } = useFormContext();

	return (
		<div>
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
			<FormDebug data={watch()} />
		</div>
	);
};

export default Sidebar;
