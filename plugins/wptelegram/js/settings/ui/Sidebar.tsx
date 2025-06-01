import { useFormContext } from '@wpsocio/form';
import { __ } from '@wpsocio/i18n';
import { PluginInfoCard } from '@wpsocio/shared-ui/components/plugin-info/plugin-info-card.js';
import { WPTGSocialIcons } from '@wpsocio/shared-ui/components/wptg-social-icons.js';
import { FormDebug } from '@wpsocio/shared-ui/form/form-debug';
import { getDomData } from '../services/getDomData';
import { Upsell } from './shared/pro-upsell';

const {
	pluginInfo: { title },
	assets: { tgIconUrl },
} = getDomData();

export const Sidebar: React.FC = () => {
	const { watch } = useFormContext();

	return (
		<div>
			<PluginInfoCard
				pluginTitle={title}
				description={`${title}: ${__(
					'Integrate your WordPress website perfectly with Telegram. Send posts automatically to Telegram when published or updated, whether to a Telegram Channel, Group or private chat, with full control. Get your email notifications on Telegram.',
				)}`}
				helpText={__('Join our public chat on Telegram')}
				reviewLink="https://wordpress.org/support/plugin/wptelegram/reviews/#new-post"
				supportLink="https://t.me/WPTelegramChat"
				supportLinkText="@WPTelegramChat"
				socialIcons={<WPTGSocialIcons tgIconUrl={tgIconUrl} />}
				title={__('Support')}
				className="mb-4"
				upsell={<Upsell location="sidebar" className="font-normal" />}
			/>
			<FormDebug data={watch()} />
		</div>
	);
};
