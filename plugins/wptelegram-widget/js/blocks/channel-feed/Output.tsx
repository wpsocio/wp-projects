import { buildShortCodeFromAtts } from '@wpsocio/utilities/blocks';

const allowedAtts = ['author_photo', 'num_messages', 'widget_width'];
const shortcode = 'wptelegram-widget';

export const Output: React.FC<{ attributes: Record<string, string | number> }> =
	({ attributes }) => {
		return <>{buildShortCodeFromAtts(attributes, allowedAtts, shortcode)}</>;
	};
