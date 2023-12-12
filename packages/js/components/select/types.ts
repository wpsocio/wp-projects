export interface OptionProps {
	value?: string | number;
	label?: React.ReactNode;
	options?: Array<Omit<OptionProps, 'options'>>; // for optgroup
	[key: string]: unknown;
}

export type OptionsType = Array<OptionProps>;
