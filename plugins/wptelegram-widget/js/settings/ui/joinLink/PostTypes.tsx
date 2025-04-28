import { __ } from '@wpsocio/i18n';
import { MultiCheckboxField } from '@wpsocio/shared-ui/form/multi-checkbox-field.js';
import { getDomData, getFieldLabel } from '../../services';

const { post_types } = getDomData('uiData');

export function PostTypes() {
	return (
		<MultiCheckboxField
			name="join_link.post_types"
			description={__(
				'The join link will be automatically added to the selected post types.',
			)}
			label={getFieldLabel('post_types')}
			options={post_types}
		/>
	);
}
