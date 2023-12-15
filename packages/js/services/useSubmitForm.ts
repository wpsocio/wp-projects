import { __ } from '@wpsocio/i18n';
import { GetErrorMessage, strToPath } from '@wpsocio/utilities';
import { last } from 'ramda';
import { useCallback, useEffect, useRef } from 'react';
import type {
	FieldValues,
	SubmitHandler,
	UseFormReturn,
} from 'react-hook-form';
import { fetchAPI } from './apiFetch';
import { useDisplayFeedback } from './useDisplayFeedback';

interface SubmitFormProps<FD extends FieldValues> {
	displayFeedback?: boolean;
	form?: UseFormReturn<FD>;
	formatErrors?: (errors: unknown) => unknown;
	getErrorMessage: GetErrorMessage<Exclude<keyof FD, number | symbol>>;
	normalizeData?: (values: FD) => unknown;
	path: string; // WP REST API path
	prepDefaultValues?: (values: unknown) => unknown;
	resetForm?: boolean;
	onSubmitSuccess?: (data: unknown) => void;
}

const defaultFormatCb = (v: unknown) => v;

export const useSubmitForm = <FD extends FieldValues>({
	displayFeedback = true,
	form,
	formatErrors = defaultFormatCb,
	getErrorMessage,
	normalizeData = defaultFormatCb,
	path,
	prepDefaultValues = defaultFormatCb,
	resetForm,
	onSubmitSuccess,
}: SubmitFormProps<FD>): SubmitHandler<FD> => {
	const result = useRef<unknown>();

	const isSubmitted = form?.formState?.isSubmitted;
	const isSubmitSuccessful = form?.formState?.isSubmitSuccessful;

	useEffect(() => {
		if (resetForm && isSubmitted && isSubmitSuccessful) {
			const defaultValues = prepDefaultValues(result.current);

			// biome-ignore lint/suspicious/noExplicitAny: <explanation>
			form.reset(defaultValues as any);
		}
	}, [isSubmitted, isSubmitSuccessful, prepDefaultValues, resetForm, form]);

	const { displaySuccess, displaySubmitErrors } = useDisplayFeedback();

	const submitForm = useCallback<SubmitHandler<FD>>(
		async (values) => {
			try {
				const data = normalizeData(values);
				result.current = await fetchAPI.POST({ data, path });

				onSubmitSuccess?.(result.current);

				if (displayFeedback) {
					displaySuccess({ title: __('Changes saved successfully.') });
				}
			} catch (error) {
				console.log('ERROR', error);
				let errors: Record<string, unknown> = {};

				if (
					error &&
					typeof error === 'object' &&
					'code' in error &&
					error.code &&
					'data' in error &&
					error.data &&
					typeof error.data === 'object' &&
					'params' in error.data &&
					typeof error.data.params === 'object'
				) {
					if ('rest_invalid_param' === error.code) {
						const { params = {} } = error.data;

						for (const key in params) {
							const path = strToPath(key);

							const error = {
								message: getErrorMessage(
									last(path) as Exclude<keyof FD, number | symbol>,
									'invalid',
								),
								type: 'submit',
							};
							errors[path.join('.')] = error;
						}
					} else if (
						'rest_missing_callback_param' === error.code &&
						Array.isArray(error.data.params)
					) {
						for (const key of error.data.params) {
							const path = strToPath(key);
							const error = {
								// biome-ignore lint/suspicious/noExplicitAny: <explanation>
								message: getErrorMessage(last(path) as any, 'required'),
								type: 'submit',
							};
							errors[path.join('.')] = error;
						}
					}
				}

				// if form is provided, set field errors
				if (form) {
					for (const [key, error] of Object.entries(errors)) {
						// biome-ignore lint/suspicious/noExplicitAny: <explanation>
						form.setError(key as any, error as any);
					}
				}

				errors = Object.assign(
					{},
					formatErrors(errors),
					// biome-ignore lint/suspicious/noExplicitAny: <explanation>
					getErrorMessage(null as any, null as any) as any,
				);

				if (displayFeedback) {
					displaySubmitErrors(errors);
				}

				return [false, errors];
			}
			return [true, result.current];
		},
		[
			displayFeedback,
			displaySubmitErrors,
			displaySuccess,
			form,
			formatErrors,
			getErrorMessage,
			normalizeData,
			onSubmitSuccess,
			path,
		],
	);

	return submitForm;
};
