import { Divider } from '@wpsocio/adapters';
import { FeildStack, FeildStackItem, SectionCard } from '@wpsocio/components';
import { FormField } from '@wpsocio/form';
import { __ } from '@wpsocio/i18n';

import { And, P2TGCustomRules } from '@wpsocio/shared-wptelegram-ui';

import { getFieldLabel, useData } from './../../services';
import { Upsell } from './../shared/Upsell';
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

export const Rules: React.FC = () => {
	const {
		api: { rest_namespace = '' },
		uiData: { post_types, rule_types },
	} = useData();

	return (
		<SectionCard title={__('Rules')}>
			<FeildStack>
				<FeildStackItem flexBasis="48%">
					<FormField
						name={`${PREFIX}.send_when`}
						fieldType="multicheck"
						label={getFieldLabel('send_when')}
						description={__('When the post should be sent to Telegram.')}
						options={getSendWhenOptions()}
						controlClassName="no-flex"
					/>
				</FeildStackItem>
				<FeildStackItem flexBasis="48%">
					<FormField
						name={`${PREFIX}.post_types`}
						fieldType="multicheck"
						label={getFieldLabel('post_types')}
						description={__('Which post types should be sent.')}
						options={post_types}
						controlClassName="no-flex"
					/>
				</FeildStackItem>
			</FeildStack>
			<Divider my="0" />
			<And />
			<P2TGCustomRules
				prefix={PREFIX}
				rule_types={rule_types}
				rest_namespace={rest_namespace}
			/>
			<Upsell location="rules" textAlign="center" />
		</SectionCard>
	);
};
