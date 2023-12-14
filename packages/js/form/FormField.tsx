import type { FormFieldProps, DataShape, FieldType } from './types';
import { Field, Group, Repeatable } from './fields';

export const FormField = <TFieldType extends FieldType, TDataShape extends DataShape>(
	props: FormFieldProps<TFieldType, TDataShape>
): JSX.Element => {
	const { fieldType } = props;

	if (!fieldType) {
		throw new Error('fieldType is required');
	}

	const { isRepeatable, ...rest } = props as any;

	if (isRepeatable) {
		return <Repeatable {...rest} />;
	}

	if (fieldType === 'group') {
		return <Group {...rest} />;
	}

	return <Field {...rest} />;
};
