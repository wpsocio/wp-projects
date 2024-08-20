import type { SubmitErrorHandler } from '@wpsocio/form';
import { useDisplayFeedback } from '@wpsocio/services/use-display-feedback.js';
import { useCallback } from 'react';

import type { DataShape } from './types';

export const useOnInvalid = (): SubmitErrorHandler<DataShape> => {
	const { displayValidationErrors } = useDisplayFeedback();

	return useCallback(
		(errors) => displayValidationErrors(errors),
		[displayValidationErrors],
	);
};
