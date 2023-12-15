import { Field, Group, Repeatable } from './fields';
import type { DataShape, FieldType, FormFieldProps } from './types';

export const FormField = <
	TFieldType extends FieldType,
	TDataShape extends DataShape,
>(
	props: FormFieldProps<TFieldType, TDataShape>,
): JSX.Element => {
	const { fieldType } = props;

	if (!fieldType) {
		throw new Error('fieldType is required');
	}

	// biome-ignore lint/suspicious/noExplicitAny: <explanation>
	const { isRepeatable, ...rest } = props as any;

	if (isRepeatable) {
		return <Repeatable {...rest} />;
	}

	if (fieldType === 'group') {
		return <Group {...rest} />;
	}

	return <Field {...rest} />;
};
