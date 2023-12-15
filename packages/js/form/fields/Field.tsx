import { useFormContext } from 'react-hook-form';

import { useFieldConditions, useFieldError } from '../hooks';
import { RenderField } from '../render';
import type { DataShape, FieldType, FormFieldProps } from '../types';

export const Field = <
	TFieldType extends FieldType,
	TDataShape extends DataShape,
>(
	props: FormFieldProps<TFieldType, TDataShape>,
): React.ReactNode => {
	const { conditions, valueAsNumber, name, ...rest } = props;

	const { register } = useFormContext();
	const error = useFieldError(props.name);
	const conditionsApply = useFieldConditions(props.name, conditions || []);

	if (!conditionsApply) {
		return null;
	}

	const fieldProps = register(name, {
		required: props.isRequired,
		valueAsNumber,
	});

	return (
		<RenderField
			{...fieldProps}
			error={error}
			// biome-ignore lint/suspicious/noExplicitAny: <explanation>
			{...(rest as any)}
		/>
	);
};
