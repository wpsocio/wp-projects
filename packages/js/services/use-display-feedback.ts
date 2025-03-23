import { __ } from '@wpsocio/i18n';
import { type ToastProps, toast } from '@wpsocio/ui/wrappers/toast';
import { FORM_ERROR } from '@wpsocio/utilities/constants.js';
import { getErrorStrings } from '@wpsocio/utilities/misc.js';
import type { AnyObject } from '@wpsocio/utilities/types.js';
import { useCallback, useMemo } from 'react';

type Toast = ToastProps & { title: string };

interface DisplayFeedback {
	displayError: (props: Toast) => void;
	displaySuccess: (props: Toast) => void;
	displayValidationErrors: (errors: AnyObject, error?: string) => void;
	displaySubmitErrors: (errors: AnyObject, submitError?: string) => void;
}

type DF = DisplayFeedback;

export const useDisplayFeedback = (): DF => {
	const displayError = useCallback<DF['displayError']>(
		({ title, ...props }) => {
			toast.error(title, props);
		},
		[],
	);

	const displaySuccess = useCallback<DF['displayError']>(
		({ title, ...props }) => {
			toast.success(title, props);
		},
		[],
	);

	const displayErrors = useCallback(
		(errors: AnyObject) => {
			const errorStrings = getErrorStrings(errors);
			for (const error of errorStrings) {
				displayError({ title: error });
			}
		},
		[displayError],
	);

	const displaySubmitErrors = useCallback<DF['displaySubmitErrors']>(
		({ [FORM_ERROR]: formError, ...errors }, submitError) => {
			// biome-ignore lint/suspicious/noConsoleLog: <explanation>
			console.log({ errors, submitError, formError });

			if (submitError || formError) {
				const title = submitError ?? formError;
				displayError({ title });
			}
			displayErrors(errors);
		},
		[displayError, displayErrors],
	);

	const displayValidationErrors = useCallback<DF['displayValidationErrors']>(
		(errors, error) => {
			const title =
				typeof error === 'string' ? error : __('Lets fix these errors first.');
			displayErrors(errors);
			displayError({ title });
		},
		[displayError, displayErrors],
	);

	return useMemo(
		() => ({
			displayError,
			displaySuccess,
			displaySubmitErrors,
			displayValidationErrors,
		}),
		[
			displayError,
			displaySuccess,
			displaySubmitErrors,
			displayValidationErrors,
		],
	);
};
