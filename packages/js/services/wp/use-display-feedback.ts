import { __ } from '@wpsocio/i18n';
import { useGlobalNotices } from '@wpsocio/ui/wp/global-notices';
import { FORM_ERROR } from '@wpsocio/utilities/constants.js';
import { getErrorStrings } from '@wpsocio/utilities/misc.js';
import type { AnyObject } from '@wpsocio/utilities/types.js';
import { useCallback, useMemo } from 'react';

interface DisplayFeedback {
	displayValidationErrors: (errors: AnyObject, error?: string) => void;
	displaySubmitErrors: (errors: AnyObject, submitError?: string) => void;
}

type DF = DisplayFeedback;

export const useDisplayFeedback = (): DF => {
	const { createErrorNotice } = useGlobalNotices();

	const displayErrors = useCallback(
		(errors: AnyObject) => {
			const errorStrings = getErrorStrings(errors);
			for (const error of errorStrings) {
				createErrorNotice(error);
			}
		},
		[createErrorNotice],
	);

	const displaySubmitErrors = useCallback<DF['displaySubmitErrors']>(
		({ [FORM_ERROR]: formError, ...errors }, submitError) => {
			// biome-ignore lint/suspicious/noConsoleLog: <explanation>
			console.log({ errors, submitError, formError });

			if (submitError || formError) {
				const title = submitError ?? formError;
				createErrorNotice(title);
			}
			displayErrors(errors);
		},
		[displayErrors, createErrorNotice],
	);

	const displayValidationErrors = useCallback<DF['displayValidationErrors']>(
		(errors, error) => {
			const title =
				typeof error === 'string' ? error : __('Lets fix these errors first.');
			createErrorNotice(title);
			displayErrors(errors);
		},
		[createErrorNotice, displayErrors],
	);

	return useMemo(
		() => ({
			displaySubmitErrors,
			displayValidationErrors,
		}),
		[displaySubmitErrors, displayValidationErrors],
	);
};
