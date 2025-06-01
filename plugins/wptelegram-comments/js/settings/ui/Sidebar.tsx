import { useFormContext } from '@wpsocio/form';
import { __ } from '@wpsocio/i18n';
import { PluginInfoCard } from '@wpsocio/shared-ui/components/plugin-info/plugin-info-card';
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
				pluginTitle={title}
				description={`${title}: ${__(
					'Use Telegram Comments widget for your WordPress posts or pages.',
				)}`}
				helpText={__('Join our public chat on Telegram')}
				reviewLink="https://wordpress.org/support/plugin/wptelegram-comments/reviews/#new-post"
				supportLink="https://t.me/WPTelegramChat"
				supportLinkText="@WPTelegramChat"
				socialIcons={<WPTGSocialIcons tgIconUrl={tgIconUrl} />}
				title={__('Support')}
			/>
			<FormDebug data={watch()} />
		</div>
	);
};

export default Sidebar;
