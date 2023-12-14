import * as yup from 'yup';

import { __ } from '@wpsocio/i18n';
import { fieldLabelGetter, getFormErrorMessage } from '@wpsocio/utilities';

const fieldLabels = {
	code: () => __('Code'),
	exclude: () => __('Exclude'),
	post_types: () => __('Post types'),
};

export const getFieldLabel = fieldLabelGetter(fieldLabels);

export const validationSchema = yup.object({
	code: yup
		.string()
		.required(() => getErrorMessage('code', 'required'))
		.matches(/^<script[^>]+?><\/script>$/i, {
			message: () => getErrorMessage('code', 'invalid'),
			excludeEmptyString: true,
		}),
});

export const getErrorMessage = getFormErrorMessage(fieldLabels);
