import type { UseFieldArrayReturn } from '@wpsocio/form';
import type { ArrayField, RepeatableValue } from '@wpsocio/form/types.js';
import type { OptionsType } from '@wpsocio/ui-components/wrappers/types.js';

/* export interface SharedProps {
	rule_types: OptionsType;
	rest_namespace: string;
	RuleSetComponent?: React.ComponentType<RuleSetProps>;
}

export interface RuleGroupProps extends SharedProps {
	rulesArray: UseFieldArrayReturn<Record<'rules', Rules>, 'rules'>;
	rulesArrayIndex: number;
	rulesArrayName: string;
}

export interface RuleSetProps extends SharedProps {
	rule: Rule;
	ruleGroupArray: UseFieldArrayReturn<Record<string, RuleGroup['value']>>;
	ruleGroupArrayName: string;
	ruleGroupArrayIndex: number;
} */

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
