import { FeildStack, FeildStackItem } from '@wpsocio/components';
import { __ } from '@wpsocio/i18n';
import { FormField, useWatch } from '@wpsocio/form';
import { prefixName } from '@wpsocio/utilities';

import { getFieldLabel } from '../services';
import type { CommonProps } from './types';

const getExcerptSourceOptions = () => [
	{
		value: 'post_content',
		label: __('Post Content'),
	},
	{
		value: 'before_more',
		label: __('Before "Read More"'),
	},
	{
		value: 'post_excerpt',
		label: __('Post Excerpt'),
	},
];

export const ExcerptSettings: React.FC<CommonProps> = ({ prefix }) => {
	const template: string =
		useWatch({ name: prefixName('message_template', prefix) }) || '';
	const hasExcerpt = template.includes('{post_excerpt}');

	return (
		<FeildStack>
			<FeildStackItem>
				<FormField
					name={prefixName('excerpt_source', prefix)}
					fieldType="select"
					label={getFieldLabel('excerpt_source')}
					options={getExcerptSourceOptions()}
					isDisabled={!hasExcerpt}
					controlClassName="no-flex"
				/>
			</FeildStackItem>
			<FeildStackItem>
				<FormField
					name={prefixName('excerpt_length', prefix)}
					fieldType="number"
					label={getFieldLabel('excerpt_length')}
					description={__('Number of words for the excerpt.')}
					valueAsNumber
					isDisabled={!hasExcerpt}
					min={1}
					max={300}
					display="inline-flex"
					controlClassName="no-flex"
				/>
			</FeildStackItem>
			<FeildStackItem>
				<FormField
					name={prefixName('excerpt_preserve_eol', prefix)}
					fieldType="switch"
					label={getFieldLabel('excerpt_preserve_eol')}
					description={__('Preserve newlines in Post Excerpt.')}
					isDisabled={!hasExcerpt}
					controlClassName="no-flex"
				/>
			</FeildStackItem>
		</FeildStack>
	);
};
