import { useCallback } from 'react';

import type { SubmitHandler, UseFormReturn } from '@wpsocio/form';
import { useSubmitForm } from '@wpsocio/services';

import { getErrorMessage } from './fields';
import type { DataShape } from './types';
import { useData } from './useData';

export const useOnSubmit = (
	form: UseFormReturn<DataShape>,
): SubmitHandler<DataShape> => {
	const { rest_namespace } = useData('api');

	const path = `${rest_namespace}/settings/`;

	const submitForm = useSubmitForm<DataShape>({
		form,
		path,
		// @ts-ignore
		getErrorMessage: getErrorMessage,
		resetForm: true,
	});

	return useCallback(async (data) => await submitForm(data), [submitForm]);
};
