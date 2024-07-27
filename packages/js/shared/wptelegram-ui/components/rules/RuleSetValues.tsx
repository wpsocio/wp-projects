import type { SimpleOptionsType } from '@wpsocio/adapters';
import { FormField, useFormContext } from '@wpsocio/form';
import { __ } from '@wpsocio/i18n';
import { moduleStorage, useLocalStorage } from '@wpsocio/services';
import { usePrevious } from '@wpsocio/utilities';
import { useCallback, useEffect, useState } from 'react';

import type { RuleSetProps } from './types';
import { useFetchRuleValues } from './useFetchRuleValues';
import { useWatchParam } from './useWatchParam';

const STORAGE_KEY = 'p2tg_rule_values';

type RuleValuesCache = { [key: string]: SimpleOptionsType };

const loadingMessage = () => __('Loading...');
const noOptionsMessage = () => __('No options available');

export const RuleSetValues: React.FC<
	RuleSetProps & { ruleSetName: string }
> = ({ rest_namespace, rule, ruleSetName }) => {
	const [isFetchingValues, setIsFetchingValues] = useState(false);
	const [defaultRuleValues, setDefaulRuleValues] = useState<SimpleOptionsType>(
		[],
	);

	const fetchRuleValues = useFetchRuleValues(rest_namespace);
	const { getItem, setItem } = useLocalStorage<RuleValuesCache>(
		STORAGE_KEY,
		{},
		moduleStorage,
	);

	const { setValue } = useFormContext();
	const param = useWatchParam(ruleSetName);

	const previousParam = usePrevious(param);

	// biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
	useEffect(() => {
		// reset values if param changes
		if (previousParam && previousParam !== param) {
			setValue(`${ruleSetName}.values`, []);
			setDefaultValues(param);
		}
	}, [param, previousParam]);

	const setDefaultValues = useCallback(
		(param: string) => {
			if (!param) {
				return;
			}
			const values = getItem(param, []);

			if (values.length) {
				setDefaulRuleValues(values);
			} else {
				fetchRuleValues({
					param,
					setInProgress: setIsFetchingValues,
					setResult: (result) => {
						setDefaulRuleValues(result as SimpleOptionsType);
						// add values to cache
						setItem(param, result);
					},
				});
			}
		},
		[fetchRuleValues, getItem, setItem],
	);

	// biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
	useEffect(() => {
		setDefaultValues(rule.param || '');
	}, []);

	const loadValuesOptions = useCallback(
		(inputValue: string, callback: (result: SimpleOptionsType) => void) => {
			fetchRuleValues({
				param,
				search: inputValue,
				setInProgress: setIsFetchingValues,
				setResult: (result) => {
					callback(result as SimpleOptionsType);
				},
			});
		},
		[fetchRuleValues, param],
	);

	return (
		<FormField
			aria-label={__('Rule values')}
			closeMenuOnSelect={false}
			className="values"
			defaultOptions={defaultRuleValues}
			// @ts-expect-error
			defaultValue={rule.values}
			fieldType="multiselect.async"
			isLoading={isFetchingValues}
			loadOptions={loadValuesOptions}
			loadingMessage={loadingMessage}
			name={`${ruleSetName}.values`}
			noOptionsMessage={noOptionsMessage}
			placeholder={__('Select...')}
		/>
	);
};
