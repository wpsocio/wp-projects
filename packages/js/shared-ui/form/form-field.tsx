import { useFormContext } from '@wpsocio/form';
import { FormField as FormFieldUI } from '@wpsocio/ui-components/wrappers/form.js';

export const FormField: React.FC<React.ComponentProps<typeof FormFieldUI>> = (
	props,
) => {
	const { control } = useFormContext();

	return <FormFieldUI control={control} {...props} />;
};
