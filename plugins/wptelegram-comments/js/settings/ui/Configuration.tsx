import { SectionCard } from '@wpsocio/components';
import { FormField } from '@wpsocio/form';
import { __ } from '@wpsocio/i18n';

import { getFieldLabel, useData } from '../services';
import { Code } from './Code';

export const Configuration = () => {
	const { post_types } = useData('uiData');

	return (
		<SectionCard title={__('Configuration')}>
			<Code />

			<FormField
				name="post_types"
				fieldType="multicheck"
				description={__(
					'The comments widget will be shown on the selected post types.',
				)}
				label={getFieldLabel('post_types')}
				options={post_types}
			/>
			<FormField
				name="exclude"
				fieldType="textarea"
				label={getFieldLabel('exclude')}
				description={__(
					'To exclude the specific posts, enter the post or page IDs separated by comma.',
				)}
				cols={60}
				rows={4}
				spellCheck={false}
				placeholder="53,281"
			/>
		</SectionCard>
	);
};
