import { forwardRef } from 'react';

import {
	MultiSelect,
	NumberInput,
	Select,
	Switch,
	TextInput,
	Textarea,
} from '@wpsocio/adapters';

import type { DataShape, FieldType, RenderFieldProps } from '../types';
import { ColorPicker } from './ColorPicker';
import { Hidden } from './Hidden';
import { MultiCheck } from './MultiCheck';
import { MultiSelectAsync } from './MultiSelectAsync';
import { Radio } from './Radio';
import { TextWithButton } from './TextWithButton';
import type { AdapterPropsMap } from './types';

export const adapterMap: {
	[K in FieldType]: React.ComponentType<AdapterPropsMap[K]> | null;
} = {
	colorpicker: ColorPicker,
	group: null,
	hidden: Hidden,
	multicheck: MultiCheck,
	multiselect: MultiSelect,
	'multiselect.async': MultiSelectAsync,
	number: NumberInput,
	radio: Radio,
	select: Select,
	switch: Switch,
	text: TextInput,
	textarea: Textarea,
	//@ts-ignore
	'text.button': TextWithButton,
};

const DefaultComponent = () => null;

const nonRefTypes: Array<FieldType> = [
	'colorpicker',
	'radio',
	'multicheck',
	'multiselect',
	'multiselect.async',
];

export type TAdapter = <
	TFieldType extends FieldType,
	TDataShape extends DataShape,
>(
	props: RenderFieldProps<TFieldType, TDataShape>,
) => React.ReactNode;

export const Adapter = forwardRef<
	TAdapter,
	RenderFieldProps<keyof AdapterPropsMap, DataShape>
>((props, ref) => {
	const { fieldType, ...rest } = props;
	const Component = adapterMap?.[fieldType] || DefaultComponent;

	const fieldRef = nonRefTypes.includes(fieldType) ? null : ref;

	return (
		<Component
			// biome-ignore lint/suspicious/noExplicitAny: <explanation>
			{...(rest as any)}
			ref={fieldRef}
		/>
	);
}) as TAdapter;
