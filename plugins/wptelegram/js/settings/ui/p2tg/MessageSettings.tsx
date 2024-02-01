import { Divider } from '@wpsocio/adapters';
import { SectionCard } from '@wpsocio/components';
import { __ } from '@wpsocio/i18n';

import {
	ExcerptSettings,
	ImageSettings,
	LinkPreviewOptions,
	MessageTemplate,
	MiscMessageSettings,
	TemplateInfo,
} from '@wpsocio/shared-wptelegram-ui';

import { useData } from './../../services';
import { Upsell } from './../shared/Upsell';
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
			<Divider />
			<ImageSettings prefix={PREFIX} />
			<Divider />
			<MiscMessageSettings prefix={PREFIX} />
			<Divider />
			<LinkPreviewOptions prefix={PREFIX} />
		</SectionCard>
	);
};
