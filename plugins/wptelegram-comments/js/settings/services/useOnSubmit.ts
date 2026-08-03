import type { SubmitHandler, UseFormReturn } from '@wpsocio/form';
import { useSubmitForm } from '@wpsocio/services/use-submit-form.js';
import { useCallback } from 'react';
import { getErrorMessage } from './fields';
import { getDomData } from './getDomData';
import type { DataShape } from './types';
import { normalizeData, prepDefaultValues } from './utils';

const { rest_namespace } = getDomData('api') || {};

export const useOnSubmit = (
	form: UseFormReturn<DataShape>,
): SubmitHandler<DataShape> => {
	const path = `${rest_namespace}/settings`;

	const submitForm = useSubmitForm<DataShape>({
		form,
		path,
		// @ts-expect-error
		getErrorMessage: getErrorMessage,
		normalizeData,
		prepDefaultValues,
		resetForm: true,
	});

	return useCallback(async (data) => await submitForm(data), [submitForm]);
};
