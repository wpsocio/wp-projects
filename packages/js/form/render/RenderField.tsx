import classNames from 'classnames';
import { forwardRef } from 'react';

import {
	Box,
	FormControl,
	FormHelperText,
	FormLabel,
	Tooltip,
} from '@wpsocio/adapters';
import { InfoOutlineIcon } from '@wpsocio/icons';

import { Adapter, AdapterPropsMap } from '../adapters';
import type { DataShape, FieldType, RenderFieldProps } from '../types';
import { ErrorMessage } from './ErrorMessage';

export type TRenderField = <
	TFieldType extends FieldType,
	TDataShape extends DataShape,
>(
	props: RenderFieldProps<TFieldType, TDataShape>,
) => React.ReactNode;

export const RenderField: TRenderField = forwardRef<
	unknown,
	RenderFieldProps<keyof AdapterPropsMap, DataShape>
>((props, ref) => {
	const {
		after,
		before,
		controlClassName,
		description,
		error,
		fieldType,
		id,
		info,
		isRequired,
		label,
		name,
		...rest
	} = props;

	const className = classNames(
		'form-control',
		`form-control-${fieldType}`,
		controlClassName,
	);

	const tooltipKey = info ? `${name}-tooltip` : null;

	const fieldId = id || name;

	// no layout stuff needed for hidden field
	if (fieldType === 'hidden') {
		return (
			<Adapter
				fieldType={fieldType}
				// @ts-ignore
				ref={ref}
				id={fieldId}
				name={name}
				{...rest}
			/>
		);
	}

	return (
		<FormControl
			className={className}
			isDisabled={rest.isDisabled}
			isInvalid={Boolean(error)}
			isRequired={isRequired}
		>
			{label ? (
				<FormLabel
					htmlFor={fieldId}
					className="form-control__label"
					alignSelf="flex-start"
					pb="1em"
				>
					{label}
					{info && (
						<Tooltip placement="top-end" label={info} aria-label={info}>
							<InfoOutlineIcon ms="0.5em" />
						</Tooltip>
					)}
				</FormLabel>
			) : null}
			<Box className="form-control__input">
				{before}
				<Adapter
					aria-label={label as string}
					aria-describedby={tooltipKey}
					// @ts-ignore
					ref={ref}
					fieldType={fieldType}
					id={fieldId}
					name={name}
					{...rest}
				/>
				<ErrorMessage name={name} />
				{description ? <FormHelperText>{description}</FormHelperText> : null}
				{after}
			</Box>
		</FormControl>
	);
}) as TRenderField;
