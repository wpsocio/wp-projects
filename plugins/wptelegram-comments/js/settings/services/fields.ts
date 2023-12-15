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
	attributes: yup.string(),
	code: yup
		.string()
		.required(() => getErrorMessage('code', 'required'))
		.matches(/^<script[^>]+?><\/script>$/i, {
			message: () => getErrorMessage('code', 'invalid'),
			excludeEmptyString: true,
		}),
	exclude: yup.string(),
	post_types: yup.array().of(yup.string()),
});

export type DataShape = ReturnType<typeof validationSchema.validateSync>;

export const getErrorMessage = getFormErrorMessage(fieldLabels);
