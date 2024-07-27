import { buildShortCodeFromAtts } from '@wpsocio/utilities/blocks';

const allowedAtts = ['widget_width', 'widget_height', 'username'];
const shortcode = 'wptelegram-ajax-widget';

export const Output: React.FC<{
	attributes: Record<string, string | number>;
}> = ({ attributes }) => {
	return <>{buildShortCodeFromAtts(attributes, allowedAtts, shortcode)}</>;
};
