import { useFormContext } from '@wpsocio/form';
import { __ } from '@wpsocio/i18n';
import { PluginInfoCard } from '@wpsocio/shared-ui/components/plugin-info/plugin-info-card.js';
import { WPTGSocialIcons } from '@wpsocio/shared-ui/components/wptg-social-icons.js';
import { FormDebug } from '@wpsocio/shared-ui/form/form-debug';
import { useData } from '../services';
import { WidgetInfoCard } from './WidgetInfoCard';

export const Sidebar: React.FC = () => {
	const {
		pluginInfo: { title },
		assets: { tgIconUrl },
	} = useData();
	const { watch } = useFormContext();
	return (
		<div>
			<PluginInfoCard
				description={`${title}: ${__(
					'Let the users login to your WordPress website with their Telegram and make it simple for them to get connected and let them receive their email notifications on Telegram.',
				)}`}
				helpText={__('Join our public chat on Telegram')}
				reviewLink="https://wordpress.org/support/plugin/wptelegram-login/reviews/#new-post"
				supportLink="https://t.me/WPTelegramChat"
				supportLinkText="@WPTelegramChat"
				socialIcons={<WPTGSocialIcons tgIconUrl={tgIconUrl} />}
				title={__('Support')}
				className="mb-4"
			/>
			<WidgetInfoCard />
			<FormDebug data={watch()} />
		</div>
	);
};
