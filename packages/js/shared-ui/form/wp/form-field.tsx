import { useFormContext } from '@wpsocio/form';
import {
	type ControllerProps,
	type FieldPath,
	type FieldValues,
	FormField as FormFieldUI,
} from '@wpsocio/ui/wp/form';

export const FormField = <
	TFieldValues extends FieldValues = FieldValues,
	TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
>({
	...props
}: ControllerProps<TFieldValues, TName>) => {
	const { control } = useFormContext<TFieldValues>();

	return <FormFieldUI control={control} {...props} />;
};
