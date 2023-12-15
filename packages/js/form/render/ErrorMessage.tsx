import { ErrorMessage as RHFErrorMessage } from '@hookform/error-message';

import { FormErrorMessage } from '@wpsocio/adapters';

export const ErrorMessage: React.FC<{ name: string }> = ({ name }) => {
	return <RHFErrorMessage name={name} render={RenderErrorMessage} />;
};

export const RenderErrorMessage: React.ComponentProps<
	typeof RHFErrorMessage
>['render'] = ({ message }) => {
	return <FormErrorMessage>{message}</FormErrorMessage>;
};
