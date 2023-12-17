import { __ } from '@wpsocio/i18n';
import { Flex } from '@wpsocio/adapters';
import { FormField } from '@wpsocio/form';

import type { RuleSetProps } from './types';
import { RuleSetValues } from './RuleSetValues';

const getOperatorOptions = () => [
	{
		value: 'in',
		label: __('is in'),
	},
	{
		value: 'not_in',
		label: __('is not in'),
	},
];

export const RuleSetFields: React.FC<RuleSetProps> = (props) => {
	const { ruleGroupArrayName, ruleGroupArrayIndex, rule, rule_types } = props;

	const ruleSetName = `${ruleGroupArrayName}.${ruleGroupArrayIndex}`;

	return (
		<Flex width="100%" className="input-group">
			<FormField
				aria-label={__('Rule type')}
				name={`${ruleSetName}.param`}
				defaultValue={rule.param}
				fieldType="select"
				options={rule_types}
				controlClassName="param"
			/>
			<FormField
				aria-label={__('Rule operator')}
				name={`${ruleSetName}.operator`}
				defaultValue={rule.operator}
				fieldType="select"
				options={getOperatorOptions()}
				controlClassName="operator"
			/>
			<RuleSetValues ruleSetName={ruleSetName} {...props} />
		</Flex>
	);
};
