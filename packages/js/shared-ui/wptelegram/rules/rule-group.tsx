import { useFieldArray } from '@wpsocio/form';
import { __ } from '@wpsocio/i18n';
import { VerticalDivider } from '@wpsocio/ui/wrappers/vertical-divider';
import { Fragment, useEffect } from 'react';
import { DEFAULT_RULE } from './constants.js';
import { RuleSet, type RuleSetProps } from './rule-set.js';
import type { RuleGroup as TRuleGroup } from './types.js';

export type RuleGroupProps = {
	onRemove?: VoidFunction;
	name: string;
	RuleSetComponent?: React.ComponentType<RuleSetProps>;
} & Pick<RuleSetProps, 'rest_namespace' | 'rule_types'>;

export const RuleGroup: React.FC<RuleGroupProps> = ({
	onRemove,
	name,
	rest_namespace,
	rule_types,
	RuleSetComponent = RuleSet,
}) => {
	const ruleGroupArrayName: string = `${name}.value`;

	const ruleGroupArray = useFieldArray<Record<string, TRuleGroup['value']>>({
		name: ruleGroupArrayName,
	});

	useEffect(() => {
		if (!ruleGroupArray.fields.length) {
			onRemove?.();
		}
	}, [ruleGroupArray.fields.length, onRemove]);

	return (
		<div className="border p-2 rounded">
			{ruleGroupArray.fields.map((rule, index, { length: ruleCount }) => (
				<Fragment key={rule.id}>
					<div>
						<RuleSetComponent
							rest_namespace={rest_namespace}
							rule_types={rule_types}
							ruleset_name={`${ruleGroupArrayName}.${index}`}
							rule={rule}
							onAdd={() => {
								ruleGroupArray.insert(index + 1, DEFAULT_RULE, {
									shouldFocus: false,
								});
							}}
							onRemove={() => {
								ruleGroupArray.remove(index);
							}}
							hasMultipleRules={ruleGroupArray.fields.length > 1}
						/>
					</div>
					{/* Do not show AND after last rule */}
					{index < ruleCount - 1 ? (
						<VerticalDivider wrapperClassName="uppercase">
							{__('And')}
						</VerticalDivider>
					) : null}
				</Fragment>
			))}
		</div>
	);
};
