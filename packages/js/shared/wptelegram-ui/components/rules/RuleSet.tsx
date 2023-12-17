import { Flex } from '@wpsocio/adapters';

import type { RuleSetProps } from './types';
import { RuleSetButtons } from './RuleSetButtons';
import { RuleSetFields } from './RuleSetFields';

const styles = { borderWidth: '1px', p: '0.2em' };

export const RuleSet: React.FC<RuleSetProps> = (props) => {
	return (
		<Flex
			className="rule-set"
			{...(props.ruleGroupArray.fields.length > 1 && styles)}
			alignItems="center"
		>
			<RuleSetFields {...props} />
			<RuleSetButtons {...props} />
		</Flex>
	);
};
