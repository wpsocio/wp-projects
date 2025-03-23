import { __ } from '@wpsocio/i18n';
import { SectionCard } from '@wpsocio/shared-ui/components/section-card.js';
import { MultiCheckboxField } from '@wpsocio/shared-ui/form/multi-checkbox-field.js';
import { P2TGCustomRules } from '@wpsocio/shared-ui/wptelegram/rules/p2tg-custom-rules.js';
import { Separator } from '@wpsocio/ui/components/separator';
import { VerticalDivider } from '@wpsocio/ui/wrappers/vertical-divider';
import { getFieldLabel } from '../../services/fields.js';
import { getDomData } from '../../services/getDomData.js';
import { Upsell } from './../shared/pro-upsell.js';
import { PREFIX } from './constants';

const getSendWhenOptions = () => [
	{
		value: 'new',
		label: __('A new post is published'),
	},
	{
		value: 'existing',
		label: __('An existing post is updated'),
	},
];

const {
	api: { rest_namespace = '' },
	uiData: { post_types, rule_types },
} = getDomData();

export const Rules: React.FC = () => {
	return (
		<SectionCard title={__('Rules')}>
			<div className="flex flex-col gap-10 md:gap-4">
				<div className="flex flex-col sm:flex-row gap-10">
					<div className="basis-[48%]">
						<MultiCheckboxField
							name={`${PREFIX}.send_when`}
							description={__('When the post should be sent to Telegram.')}
							label={getFieldLabel('send_when')}
							options={getSendWhenOptions()}
							wrapperClassName="md:block"
						/>
					</div>
					<div className="basis-[48%]">
						<MultiCheckboxField
							name={`${PREFIX}.post_types`}
							description={__('Which post types should be sent.')}
							label={getFieldLabel('post_types')}
							options={post_types}
							wrapperClassName="md:block"
						/>
					</div>
				</div>
				<div>
					<Separator className="my-0" />
					<VerticalDivider wrapperClassName="uppercase">
						{__('And')}
					</VerticalDivider>
					<P2TGCustomRules
						prefix={PREFIX}
						rule_types={rule_types}
						rest_namespace={rest_namespace}
					/>
				</div>
			</div>
			<Upsell location="rules" />
		</SectionCard>
	);
};
