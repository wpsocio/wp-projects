import { useGlobalNotices } from '@wpsocio/ui/wp/global-notices';
import { FORM_ERROR } from '@wpsocio/utilities/constants.js';
import { getErrorStrings } from '@wpsocio/utilities/misc.js';
import type { AnyObject } from '@wpsocio/utilities/types.js';
import { useCallback, useMemo } from 'react';

interface DisplayFeedback {
	clearNotices: VoidFunction;
	displayValidationErrors: (errors: AnyObject, error?: string) => void;
	displaySubmitErrors: (errors: AnyObject, submitError?: string) => void;
}

type DF = DisplayFeedback;

export const useDisplayFeedback = (): DF => {
	const { createErrorNotice, removeAllNotices } = useGlobalNotices();

	const displayErrors = useCallback(
		(errors: AnyObject) => {
			const errorStrings = getErrorStrings(errors);
			for (const error of errorStrings) {
				createErrorNotice(error);
			}
		},
		[createErrorNotice],
	);

	const clearNotices = useCallback(() => {
		removeAllNotices('snackbar');
	}, [removeAllNotices]);

	const displaySubmitErrors = useCallback<DF['displaySubmitErrors']>(
		({ [FORM_ERROR]: formError, ...errors }, submitError) => {
			// biome-ignore lint/suspicious/noConsoleLog: <explanation>
			console.log({ errors, submitError, formError });
			clearNotices();

			if (submitError || formError) {
				createErrorNotice(submitError || formError);
			}
			displayErrors(errors);
		},
		[displayErrors, createErrorNotice, clearNotices],
	);

	const displayValidationErrors = useCallback<DF['displayValidationErrors']>(
		(errors) => {
			clearNotices();
			displayErrors(errors);
		},
		[displayErrors, clearNotices],
	);

	return useMemo(
		() => ({
			clearNotices,
			displaySubmitErrors,
			displayValidationErrors,
		}),
		[clearNotices, displaySubmitErrors, displayValidationErrors],
	);
};
