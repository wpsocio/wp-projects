import { useFieldConditions, useFieldError } from '../hooks';
import { RenderRepeatable } from '../render';
import type { DataShape, FieldType, FormFieldProps } from '../types';

export const Repeatable = <
	TFieldType extends FieldType,
	TDataShape extends DataShape,
>(
	props: FormFieldProps<TFieldType, TDataShape>,
): React.ReactNode => {
	const { conditions, name, ...rest } = props;

	const conditionsApply = useFieldConditions(props.name, conditions || []);
	const error = useFieldError(props.name);

	return (
		conditionsApply && (
			<RenderRepeatable
				name={name}
				error={error as unknown as string}
				// biome-ignore lint/suspicious/noExplicitAny: <explanation>
				{...(rest as any)}
			/>
		)
	);
};
