import type { AnyObject } from '@wpsocio/utilities/types';
import { type PropsWithChildren, useEffect } from 'react';
import { FormProvider, type UseFormReturn } from 'react-hook-form';

export interface FormProps<FormValues extends AnyObject>
	extends React.FormHTMLAttributes<HTMLFormElement> {
	form: UseFormReturn<FormValues>;
	as?: React.ElementType;
	id: string;
}

declare global {
	interface Window {
		// biome-ignore lint/suspicious/noExplicitAny: <explanation>
		__WP_RHF_FORMS__: Record<string, UseFormReturn<any>>;
	}
}

export const Form = <FormValues extends AnyObject>({
	children,
	form,
	as: As = 'form',
	id,
	...rest
}: PropsWithChildren<FormProps<FormValues>>): React.ReactNode => {
	useEffect(() => {
		window.__WP_RHF_FORMS__ = { ...window.__WP_RHF_FORMS__, [id]: form };
	}, [form, id]);

	return (
		<FormProvider {...form}>
			<As {...rest} id={id}>
				{children}
			</As>
		</FormProvider>
	);
};
