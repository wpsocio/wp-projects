import type {
	BoxProps,
	ColorPickerProps,
	MultiCheckProps,
	NumberInputProps,
	RadioProps,
	MultiSelectAsyncProps,
	MultiSelectProps,
	SelectProps,
	SwitchProps,
	TextInputProps,
	TextareaProps,
} from '@wpsocio/adapters';
import type { HiddenProps } from './Hidden';

export interface AdapterPropsMap {
	colorpicker: ColorPickerProps;
	group: BoxProps;
	hidden: HiddenProps;
	multicheck: MultiCheckProps;
	multiselect: MultiSelectProps;
	'multiselect.async': MultiSelectAsyncProps;
	number: NumberInputProps;
	radio: RadioProps;
	select: SelectProps;
	switch: SwitchProps;
	text: TextInputProps;
	textarea: TextareaProps;
	'text.button': TextInputProps;
}
