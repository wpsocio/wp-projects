import { __ } from '@wpsocio/i18n';
import { SectionCard } from '@wpsocio/shared-ui/components/section-card.js';
import { ExcerptSettings } from '@wpsocio/shared-ui/wptelegram/excerpt-settings.js';
import { ImageSettings } from '@wpsocio/shared-ui/wptelegram/image-settings.js';
import { LinkPreviewOptions } from '@wpsocio/shared-ui/wptelegram/link-preview-options.js';
import { MessageTemplate } from '@wpsocio/shared-ui/wptelegram/message-template.js';
import { MiscMessageSettings } from '@wpsocio/shared-ui/wptelegram/misc-message-settings';
import { TemplateInfo } from '@wpsocio/shared-ui/wptelegram/template-info.js';
import { Separator } from '@wpsocio/ui-components/ui/separator.js';
import { useData } from './../../services/useData';
import { Upsell } from './../shared/pro-upsell.js';
import { PREFIX } from './constants';

export const MessageSettings: React.FC = () => {
	const { macros } = useData('uiData');

	return (
		<SectionCard title={__('Message Settings')}>
			<MessageTemplate prefix={PREFIX} />
			<TemplateInfo
				docsLink="https://wptelegram.pro/docs/template-conditional-logic/"
				macros={macros}
			>
				<Upsell location="template" />
			</TemplateInfo>
			<ExcerptSettings prefix={PREFIX} />
			<Separator />
			<ImageSettings prefix={PREFIX} />
			<Separator />
			<MiscMessageSettings prefix={PREFIX} />
			<Separator />
			<LinkPreviewOptions prefix={PREFIX} />
		</SectionCard>
	);
};
