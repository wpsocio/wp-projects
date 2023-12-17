import { Box, Text } from '@wpsocio/adapters';
import { useFieldArray } from '@wpsocio/form';
import { __ } from '@wpsocio/i18n';
import { prefixName } from '@wpsocio/utilities';

import type { CommonProps } from '../types';
import { AddRuleGroup } from './AddRuleGroup';
import { Or } from './Or';
import { RuleGroup } from './RuleGroup';
import type { SharedProps } from './types';

import './styles.scss';

const styles = { p: '0.5em', borderWidth: '1px' };

export interface CustomRulesProps extends CommonProps, SharedProps {}

export const P2TGCustomRules: React.FC<CustomRulesProps> = ({
	prefix,
	rest_namespace,
	rule_types,
	RuleSetComponent,
}) => {
	const rulesArrayName = prefixName('rules', prefix);
	const rulesArray = useFieldArray({ name: rulesArrayName });

	// padding and border only if there is more than one rule group
	const props = rulesArray.fields?.length > 1 ? styles : null;

	return (
		<Box className="custom-rules" {...props}>
			{rulesArray.fields.map((ruleGroup, index) => {
				return (
					<Box key={ruleGroup.id}>
						<RuleGroup
							rest_namespace={rest_namespace}
							rule_types={rule_types}
							// @ts-expect-error
							rulesArray={rulesArray}
							rulesArrayIndex={index}
							rulesArrayName={rulesArrayName}
							RuleSetComponent={RuleSetComponent}
						/>
						<Or />
					</Box>
				);
			})}
			<Box textAlign="center" mt="1em">
				{!rulesArray.fields?.length && (
					<Text mb="1em">
						{__('You can also define custom rules to send the posts.')}
					</Text>
				)}
				<AddRuleGroup
					// @ts-expect-error
					rulesArray={rulesArray}
				/>
			</Box>
		</Box>
	);
};
