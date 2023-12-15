export type SimpleOptionProps = {
	value: string;
	label: string;
};

export type SimpleOptionsType = Array<SimpleOptionProps>;

export interface OptionProps<Value = string | number, Label = React.ReactNode> {
	value?: Value;
	label?: Label;
	options?: Array<Omit<OptionProps<Value, Label>, 'options'>>; // for optgroup
}

export type OptionsType<
	Value = string | number,
	Label = React.ReactNode,
> = Array<OptionProps<Value, Label>>;
