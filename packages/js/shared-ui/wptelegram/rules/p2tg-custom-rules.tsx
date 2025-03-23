import { useFieldArray } from '@wpsocio/form';
import { __ } from '@wpsocio/i18n';
import { cn } from '@wpsocio/ui/lib/utils';
import { VerticalDivider } from '@wpsocio/ui/wrappers/vertical-divider';
import { prefixName } from '@wpsocio/utilities/misc.js';
import { AddRuleGroup } from './add-rule-group.js';
import { DEFAULT_RULE } from './constants.js';
import { RuleGroup } from './rule-group.js';
import type { RuleGroupProps } from './rule-group.js';

export type CustomRulesProps = Omit<RuleGroupProps, 'name'> & {
	prefix?: string;
};

export const P2TGCustomRules: React.FC<CustomRulesProps> = ({
	prefix,
	rest_namespace,
	rule_types,
	RuleSetComponent,
}) => {
	const rulesArrayName = prefixName('rules', prefix);
	const rulesArray = useFieldArray({ name: rulesArrayName });

	return (
		<div
			className={cn({
				// padding and border only if there is more than one rule group
				'p-2 border': rulesArray.fields?.length > 1,
			})}
		>
			{rulesArray.fields.map((ruleGroup, index) => {
				return (
					<div key={ruleGroup.id}>
						<RuleGroup
							name={`${rulesArrayName}.${index}`}
							onRemove={() => {
								rulesArray.remove(index);
							}}
							rest_namespace={rest_namespace}
							rule_types={rule_types}
							RuleSetComponent={RuleSetComponent}
						/>
						<VerticalDivider wrapperClassName="uppercase">
							{__('Or')}
						</VerticalDivider>
					</div>
				);
			})}
			<div className="text-center mt-4">
				{!rulesArray.fields?.length && (
					<p className="mb-4">
						{__('You can also define custom rules to send the posts.')}
					</p>
				)}
				<AddRuleGroup
					onAdd={() => {
						rulesArray.append(
							{ value: [DEFAULT_RULE] },
							{ shouldFocus: false },
						);
					}}
				/>
			</div>
		</div>
	);
};
