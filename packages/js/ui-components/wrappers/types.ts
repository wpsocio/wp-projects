export type OptionProps<ExtraProps = unknown> = {
	label: string;
	value: string;
} & ExtraProps;

export type OptionsType<ExtraProps = unknown> = Array<OptionProps<ExtraProps>>;
