import { UseToastOptions, useToast } from '@chakra-ui/toast';
import { useCallback, useMemo } from 'react';

import { __ } from '@wpsocio/i18n';
import { AnyObject, FORM_ERROR, getErrorStrings } from '@wpsocio/utilities';

interface DisplayFeedback {
	displayError: (props: UseToastOptions) => void;
	displaySuccess: (props: UseToastOptions) => void;
	displayValidationErrors: (errors: AnyObject, error?: string) => void;
	displaySubmitErrors: (errors: AnyObject, submitError?: string) => void;
}

type DF = DisplayFeedback;

export const useDisplayFeedback = (): DF => {
	const toast = useToast();

	const displayError = useCallback<DF['displayError']>(
		(props) => {
			toast({
				status: 'error',
				isClosable: true,
				...props,
			});
		},
		[toast],
	);

	const displaySuccess = useCallback<DF['displayError']>(
		(props) => {
			toast({
				status: 'success',
				isClosable: true,
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
			if (submitError || formError) {
				const title = submitError ?? formError;
				displayError({ title, status: 'warning' });
			}
			displayErrors(errors);
		},
		[displayError, displayErrors],
	);

	const displayValidationErrors = useCallback<DF['displayValidationErrors']>(
		(errors, error) => {
			const title =
				typeof error === 'string' ? error : __('Lets fix these errors first.');
			displayError({ title, status: 'warning' });
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
