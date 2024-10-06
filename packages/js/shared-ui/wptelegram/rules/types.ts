import type { ArrayField, RepeatableValue } from '@wpsocio/form/types.js';
import type { OptionsType } from '@wpsocio/ui-components/wrappers/types.js';

export type Rule = Partial<
	ArrayField<{
		param: string;
		custom_param?: string;
		operator: 'in' | 'not_in';
		values: OptionsType;
	}>
>;

export type RuleGroup = Partial<ArrayField<RepeatableValue<Array<Rule>>>>;

export type Rules = Array<RuleGroup>;
