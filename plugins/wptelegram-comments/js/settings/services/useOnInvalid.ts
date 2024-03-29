import { useCallback } from 'react';

import type { SubmitErrorHandler } from '@wpsocio/form';
import { useDisplayFeedback } from '@wpsocio/services';

import type { DataShape } from './types';

export const useOnInvalid = (): SubmitErrorHandler<DataShape> => {
	const { displayValidationErrors } = useDisplayFeedback();

	return useCallback(
		(errors) => displayValidationErrors(errors),
		[displayValidationErrors],
	);
};
