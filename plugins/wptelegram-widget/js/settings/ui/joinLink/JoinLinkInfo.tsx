import { __ } from '@wpsocio/i18n';
import { WidgetInfo } from '@wpsocio/shared-ui/components/widget-info/widget-info.js';
import { getDomData } from '../../services';

const { admin_url = '' } = getDomData('api');

export const JoinLinkInfo = () => {
	return (
		<WidgetInfo
			adminUrl={admin_url}
			phpCode={`if ( function_exists( 'wptelegram_join_channel' ) ) {\n\twptelegram_join_channel();\n}`}
			title={__('WP Telegram Join Channel')}
			shortcode1="[wptelegram-join-channel]"
			shortcode2='[wptelegram-join-channel link="https://t.me/WPTelegram" text="Join us on Telegram"]'
		/>
	);
};
