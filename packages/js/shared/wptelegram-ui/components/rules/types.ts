import type { SimpleOptionsType } from '@wpsocio/adapters';
import type { UseFieldArrayReturn } from '@wpsocio/form';

import type { Rule, RuleGroup, Rules } from '../../services';

export interface SharedProps {
	rule_types: SimpleOptionsType;
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
}
