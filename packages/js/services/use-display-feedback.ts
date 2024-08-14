import { __ } from '@wpsocio/i18n';
import { type Toast, useToast } from '@wpsocio/ui-components/ui/use-toast.js';
import { FORM_ERROR } from '@wpsocio/utilities/constants.js';
import { getErrorStrings } from '@wpsocio/utilities/misc.js';
import type { AnyObject } from '@wpsocio/utilities/types.js';
import { useCallback, useMemo } from 'react';

interface DisplayFeedback {
	displayError: (props: Toast) => void;
	displaySuccess: (props: Toast) => void;
	displayValidationErrors: (errors: AnyObject, error?: string) => void;
	displaySubmitErrors: (errors: AnyObject, submitError?: string) => void;
}

type DF = DisplayFeedback;

export const useDisplayFeedback = (): DF => {
	const { toast } = useToast();

	const displayError = useCallback<DF['displayError']>(
		(props) => {
			toast({
				...props,
				variant: 'destructive',
			});
		},
		[toast],
	);

	const displaySuccess = useCallback<DF['displayError']>(
		(props) => {
			toast({
				...props,
			});
		},
		[toast],
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
			console.log({ errors, submitError, formError });

			if (submitError || formError) {
				const title = submitError ?? formError;
				displayError({ title, variant: 'destructive' });
			}
			displayErrors(errors);
		},
		[displayError, displayErrors],
	);

	const displayValidationErrors = useCallback<DF['displayValidationErrors']>(
		(errors, error) => {
			const title =
				typeof error === 'string' ? error : __('Lets fix these errors first.');
			displayError({ title, variant: 'destructive' });
			displayErrors(errors);
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
