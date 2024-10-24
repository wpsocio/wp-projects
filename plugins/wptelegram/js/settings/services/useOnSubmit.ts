import type { SubmitHandler, UseFormReturn } from '@wpsocio/form';
import { useSubmitForm } from '@wpsocio/services/use-submit-form';
import { useCallback } from 'react';
import { getErrorMessage } from './fields';
import type { DataShape } from './types';
import { useData } from './useData';
import { normalizeData, prepDefaultValues } from './utils';

export const useOnSubmit = (
	form: UseFormReturn<DataShape>,
): SubmitHandler<DataShape> => {
	const { rest_namespace } = useData('api');

	const path = `${rest_namespace}/settings/`;

	const submitForm = useSubmitForm({
		// @ts-expect-error
		form,
		path,
		// @ts-expect-error
		getErrorMessage: getErrorMessage,
		normalizeData,
		// @ts-expect-error
		prepDefaultValues,
		resetForm: true,
	});

	return useCallback(async (data) => await submitForm(data), [submitForm]);
};
