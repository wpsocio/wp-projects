import { __ } from '@wpsocio/i18n';
import { WidgetInfo } from '@wpsocio/shared-ui/components/widget-info/widget-info.js';
import { getDomData } from '../../services';

const { admin_url = '' } = getDomData('api');

export const AjaxWidgetInfo = () => {
	return (
		<WidgetInfo
			adminUrl={admin_url}
			phpCode={`if ( function_exists( 'wptelegram_ajax_widget' ) ) {\n\twptelegram_ajax_widget();\n}`}
			title={__('WP Telegram Ajax Widget')}
			shortcode1='[wptelegram-ajax-widget username="WPTelegram" width="100%" height="500px"]'
			shortcode2='[wptelegram-ajax-widget width="98%" height="700px"]'
		/>
	);
};
