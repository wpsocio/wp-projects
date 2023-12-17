import { Fragment, useEffect } from 'react';

import { Box } from '@wpsocio/adapters';
import { useFieldArray } from '@wpsocio/form';

import type { RuleGroup as RuleGroupType } from '../../services';
import { And } from './And';
import { RuleSet } from './RuleSet';
import type { RuleGroupProps } from './types';

export const RuleGroup: React.FC<RuleGroupProps> = ({
	rulesArray,
	rulesArrayIndex,
	rulesArrayName,
	rest_namespace,
	rule_types,
	RuleSetComponent = RuleSet,
}) => {
	const ruleGroupArrayName: string = `${rulesArrayName}.${rulesArrayIndex}.value`;

	const ruleGroupArray = useFieldArray<Record<string, RuleGroupType['value']>>({
		name: ruleGroupArrayName,
	});

	useEffect(() => {
		if (!ruleGroupArray.fields.length) {
			rulesArray.remove(rulesArrayIndex);
		}
	}, [ruleGroupArray.fields.length, rulesArray, rulesArrayIndex]);

	const ruleCount = ruleGroupArray.fields.length;

	return (
		<Box className="rule-group" borderWidth="1px" p="0.5em">
			{ruleGroupArray.fields.map((rule, index) => (
				<Fragment key={rule.id}>
					<Box>
						<RuleSetComponent
							rest_namespace={rest_namespace}
							rule_types={rule_types}
							ruleGroupArray={ruleGroupArray}
							ruleGroupArrayIndex={index}
							ruleGroupArrayName={ruleGroupArrayName}
							rule={rule}
						/>
					</Box>
					{/* Do not show AND after last rule */}
					{index < ruleCount - 1 ? <And /> : null}
				</Fragment>
			))}
		</Box>
	);
};
