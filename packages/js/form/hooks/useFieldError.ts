import { getValueByPath } from '@wpsocio/utilities/misc.js';
import { type FieldError, useFormState } from 'react-hook-form';

export const useFieldError = (name: string): FieldError | undefined => {
	const { errors } = useFormState({ name });

	return getValueByPath<FieldError>(name)(errors);
};
