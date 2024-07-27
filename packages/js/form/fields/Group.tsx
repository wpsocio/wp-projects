import classNames from 'classnames';

import { Box } from '@wpsocio/adapters';

import { FormField } from '../FormField';
import { useFieldConditions } from '../hooks';
import type { DataShape, FormFieldProps } from '../types';

export const Group = <TFieldType extends 'group', TDataShape extends DataShape>(
	props: FormFieldProps<TFieldType, TDataShape>,
): React.ReactNode => {
	const {
		after,
		before,
		conditions,
		defaultValue,
		groupClassName,
		groupItemProps,
		label,
		name: groupName,
		subFields,
	} = props;

	const conditionsApply = useFieldConditions(groupName, conditions || []);

	if (subFields?.length && conditionsApply) {
		return (
			<Box className="field-group-wrap">
				<h5>{label}</h5>
				{before}
				<Box className={classNames('field-group-items', groupClassName)}>
					{subFields.map(({ name: fieldname, fieldType, ...rest }, i) => {
						const name = `${groupName}.${fieldname}`;
						const className = classNames(
							'field-group-item',
							groupItemProps?.className,
							fieldname,
						);

						return (
							<Box
								{...groupItemProps}
								className={className}
								// biome-ignore lint/suspicious/noArrayIndexKey: it's fine
								key={name + i}
							>
								<FormField
									{...rest}
									//@ts-ignore
									defaultValue={defaultValue?.[fieldname]}
									fieldType={fieldType}
									name={name}
								/>
							</Box>
						);
					})}
				</Box>
				{after}
			</Box>
		);
	}
	return null;
};

export default Group;
