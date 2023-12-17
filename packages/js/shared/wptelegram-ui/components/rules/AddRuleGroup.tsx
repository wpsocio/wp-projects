import { useCallback } from 'react';

import { Button } from '@wpsocio/adapters';
import { AddIcon } from '@wpsocio/icons';
import { __ } from '@wpsocio/i18n';

import { DEFAULT_RULE } from './constants';
import type { RuleGroupProps } from './types';

type AddRuleGroupProps = Pick<RuleGroupProps, 'rulesArray'>;

export const AddRuleGroup: React.FC<AddRuleGroupProps> = ({ rulesArray }) => {
	const onClick = useCallback(() => {
		rulesArray.append({ value: [DEFAULT_RULE] }, { shouldFocus: false });
	}, [rulesArray]);

	return (
		<Button leftIcon={<AddIcon />} onClick={onClick}>
			{__('Add')}
		</Button>
	);
};
