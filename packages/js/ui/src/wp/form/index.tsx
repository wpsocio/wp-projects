import { Slot } from '@radix-ui/react-slot';
import { __experimentalView as View } from '@wordpress/components';
import clsx from 'clsx';
import { createContext, forwardRef, useContext, useId } from 'react';
import {
	Controller,
	type ControllerProps,
	type FieldPath,
	type FieldValues,
	FormProvider,
	useFormContext,
} from 'react-hook-form';
import styles from './styles.module.scss';

type FormFieldContextValue<
	TFieldValues extends FieldValues = FieldValues,
	TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
> = {
	name: TName;
};

const FormFieldContext = createContext<FormFieldContextValue>(
	{} as FormFieldContextValue,
);

const FormField = <
	TFieldValues extends FieldValues = FieldValues,
	TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
>({
	...props
}: ControllerProps<TFieldValues, TName>) => {
	return (
		<FormFieldContext.Provider value={{ name: props.name }}>
			<Controller {...props} />
		</FormFieldContext.Provider>
	);
};

const useFormField = () => {
	const fieldContext = useContext(FormFieldContext);
	const itemContext = useContext(FormItemContext);
	const { getFieldState, formState } = useFormContext();

	const fieldState = getFieldState(fieldContext.name, formState);

	if (!fieldContext) {
		throw new Error('useFormField should be used within <FormField>');
	}

	const { id } = itemContext;

	return {
		id,
		name: fieldContext.name,
		formItemId: `${id}-form-item`,
		formDescriptionId: `${id}-form-item-description`,
		formMessageId: `${id}-form-item-message`,
		...fieldState,
	};
};

type FormItemContextValue = {
	id: string;
};

const FormItemContext = createContext<FormItemContextValue>(
	{} as FormItemContextValue,
);

const FormItem = forwardRef<
	HTMLDivElement,
	React.HTMLAttributes<HTMLDivElement>
>((props, ref) => {
	const id = useId();

	return (
		<FormItemContext.Provider value={{ id }}>
			<div ref={ref} {...props} />
		</FormItemContext.Provider>
	);
});
FormItem.displayName = 'FormItem';

const FormLabel = forwardRef<
	React.ElementRef<'label'>,
	React.ComponentPropsWithoutRef<'label'> & { isRequired?: boolean }
>(({ className, children, isRequired, ...props }, ref) => {
	const { error, formItemId } = useFormField();

	return (
		<View
			as="label"
			ref={ref}
			className={clsx(
				styles['form-label'],
				{ [styles['form-label--error']]: error },
				className,
			)}
			htmlFor={formItemId}
			{...props}
		>
			<>
				{children}
				{isRequired && (
					<span
						role="presentation"
						aria-hidden="true"
						className={styles['form-label--required']}
					>
						{'*'}
					</span>
				)}
			</>
		</View>
	);
});
FormLabel.displayName = 'FormLabel';

const FormControl = forwardRef<
	React.ElementRef<typeof Slot>,
	React.ComponentPropsWithoutRef<typeof Slot>
>(({ ...props }, ref) => {
	const { error, formItemId, formDescriptionId, formMessageId } =
		useFormField();

	return (
		<Slot
			ref={ref}
			id={formItemId}
			aria-describedby={
				!error
					? `${formDescriptionId}`
					: `${formDescriptionId} ${formMessageId}`
			}
			aria-invalid={!!error}
			{...props}
		/>
	);
});
FormControl.displayName = 'FormControl';

const FormDescription = forwardRef<
	HTMLParagraphElement,
	React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => {
	const { formDescriptionId } = useFormField();

	return (
		<p
			ref={ref}
			id={formDescriptionId}
			className={clsx(styles['form-description'], className)}
			{...props}
		/>
	);
});
FormDescription.displayName = 'FormDescription';

const FormMessage = forwardRef<
	HTMLSpanElement,
	React.HTMLAttributes<HTMLSpanElement>
>(({ className, children, ...props }, ref) => {
	const { error, formMessageId } = useFormField();
	const body = error ? String(error?.message) : children;

	if (!body) {
		return null;
	}

	return (
		<span
			ref={ref}
			id={formMessageId}
			className={clsx(styles['form-message'], className)}
			{...props}
		>
			{body}
		</span>
	);
});
FormMessage.displayName = 'FormMessage';

export {
	useFormField,
	FormProvider,
	FormItem,
	FormLabel,
	FormControl,
	FormDescription,
	FormMessage,
	FormField,
};

export type { ControllerProps, FieldPath, FieldValues };
