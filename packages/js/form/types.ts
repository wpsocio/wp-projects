import type { ArrayPath, FieldPath, Path } from 'react-hook-form';

import type { BoxProps, ButtonProps, OptionsType } from '@wpsocio/adapters';
import type { AdapterPropsMap } from './adapters';

export type DataShape = Record<string, unknown>;

export type FieldType = keyof AdapterPropsMap;

export type FieldValue = string | number | readonly string[];

export type ArrayField<T> = T & { id?: string };

export type { Path, FieldPath, ArrayPath };

export type CommonFieldProps<
	TFieldType extends FieldType,
	TDataShape extends DataShape,
> = {
	after?: React.ReactNode;
	before?: React.ReactNode;
	className?: string;
	conditions?: FieldConditions;
	controlClassName?: string;
	defaultValue?: FieldValue;
	description?: React.ReactNode;
	fieldType: TFieldType;
	id?: string;
	info?: string;
	isDisabled?: boolean;
	isRequired?: boolean;
	label?: React.ReactNode;
	name: FieldPath<TDataShape>;
	options?: OptionsType;
	placeholder?: string;
	valueAsNumber?: boolean;
};

export type RepeatableValue<T = unknown> = { value?: T; id?: string };

export type AfterRowProps = {
	name: string;
};

export type RepeatableProps<
	TFieldType extends FieldType,
	TDataShape extends DataShape,
> = CommonFieldProps<TFieldType, TDataShape> & {
	addButtonLabel?: string;
	afterRow?: React.ComponentType<AfterRowProps>;
	defaultItem?: unknown;
	initialLabel?: React.ReactNode;
	isRepeatable: true;
	renderAsSection?: boolean;
	repeatableItemLabel?: (index: number) => string;
};

export type FormFieldProps<
	TFieldType extends FieldType,
	TDataShape extends DataShape,
> = Omit<AdapterPropsMap[TFieldType], 'onChange'> &
	(
		| CommonFieldProps<TFieldType, TDataShape>
		| RepeatableProps<TFieldType, TDataShape>
	) &
	(TFieldType extends 'text.button'
		? { button?: React.ComponentType<ButtonProps> }
		: unknown) &
	(TFieldType extends 'group'
		? {
				groupClassName?: string;
				groupItemProps?: BoxProps;
				subFields?: FieldList<FieldType, TDataShape>;
		  }
		: unknown);

export type RenderFieldProps<
	TFieldType extends FieldType,
	TDataShape extends DataShape,
> = FormFieldProps<TFieldType, TDataShape> & {
	error?: string;
};

export type RenderRepeatableProps<
	TFieldType extends FieldType,
	TDataShape extends DataShape,
> = RepeatableProps<TFieldType, TDataShape> & {
	error?: string;
};

export interface FieldCondition {
	field: string;
	compare:
		| '='
		| '!='
		| '!='
		| '>'
		| '>='
		| '<'
		| '<='
		| 'EMPTY'
		| 'NOT_EMPTY'
		| 'CONTAINS'
		| 'NOT_CONTAINS'
		| 'MATCHES'
		| 'NOT_MATCHES';
	value?: unknown;
}

export type FieldConditions = Array<FieldCondition>;

type FieldList<
	TFieldType extends FieldType,
	TDataShape extends DataShape,
> = Array<FormFieldProps<TFieldType, TDataShape>>;
