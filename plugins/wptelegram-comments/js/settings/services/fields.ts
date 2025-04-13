import { __, sprintf } from '@wpsocio/i18n';
import {
	fieldLabelGetter,
	getFormErrorMessage,
} from '@wpsocio/utilities/fields';
import { z } from 'zod';

const fieldLabels = {
	code: () => __('Code'),
	exclude: () => __('Exclude'),
	post_types: () => __('Post types'),
};

export const getFieldLabel = fieldLabelGetter(fieldLabels);

export const validationSchema = z.object({
	attributes: z.string().optional(),
	code: z
		.string()
		.min(1, sprintf(__('%s required.'), getFieldLabel('code')))
		.regex(
			/^<script[^>]+?><\/script>$/i,
			sprintf(__('Invalid %s'), getFieldLabel('code')),
		),
	exclude: z.string().optional(),
	post_types: z.array(z.string()).optional(),
});

export type DataShape = z.input<typeof validationSchema>;

export const getErrorMessage = getFormErrorMessage(fieldLabels);
