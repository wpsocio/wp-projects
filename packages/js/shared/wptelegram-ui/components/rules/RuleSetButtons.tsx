import { useCallback } from 'react';

import { __ } from '@wpsocio/i18n';
import { AddIcon, CloseIcon } from '@wpsocio/icons';
import { Box, Flex, IconButton } from '@wpsocio/adapters';

import { DEFAULT_RULE } from './constants';
import type { RuleSetProps } from './types';

export const RuleSetButtons: React.FC<RuleSetProps> = (props) => {
	const { ruleGroupArray, ruleGroupArrayIndex } = props;

	const onAdd = useCallback(() => {
		ruleGroupArray.insert(ruleGroupArrayIndex + 1, DEFAULT_RULE, {
			shouldFocus: false,
		});
	}, [ruleGroupArray, ruleGroupArrayIndex]);

	const onRemove = useCallback(() => {
		ruleGroupArray.remove(ruleGroupArrayIndex);
	}, [ruleGroupArray, ruleGroupArrayIndex]);

	return (
		<Flex alignItems="center">
			<Box ps="0.5em">
				<IconButton
					aria-label={__('Add')}
					icon={<AddIcon />}
					onClick={onAdd}
					title={__('Add')}
					variant="outline"
				/>
			</Box>
			<Box ps="0.5em">
				<IconButton
					aria-label={__('Remove')}
					icon={<CloseIcon />}
					onClick={onRemove}
					title={__('Remove')}
					variant="outline"
				/>
			</Box>
		</Flex>
	);
};
