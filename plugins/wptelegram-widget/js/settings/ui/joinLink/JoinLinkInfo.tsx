import { WidgetInfo } from '@wpsocio/components';
import { __ } from '@wpsocio/i18n';
import { useData } from '../../services';

export const JoinLinkInfo = () => {
	const { admin_url = '' } = useData('api');

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
