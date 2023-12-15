import { FieldError, useFormState } from 'react-hook-form';

import { getValueByPath } from '@wpsocio/utilities';

export const useFieldError = (name: string): FieldError | undefined => {
	const { errors } = useFormState({ name });

	return getValueByPath<FieldError>(name)(errors);
};
