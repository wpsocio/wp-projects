import { useFormContext } from '@wpsocio/form';
import { __ } from '@wpsocio/i18n';
import { moduleStorage } from '@wpsocio/services/module-storage.js';
import { useLocalStorage } from '@wpsocio/services/use-local-storage.js';
import { FormControl, FormItem } from '@wpsocio/ui-components/wrappers/form.js';
import { ReactAsyncSelect } from '@wpsocio/ui-components/wrappers/react-select.js';
import type { OptionsType } from '@wpsocio/ui-components/wrappers/types.js';
import { usePrevious } from '@wpsocio/utilities/hooks/usePrevious.js';
import { useCallback, useEffect, useState } from 'react';
import { FormField } from '../../form/form-field.js';
import type { Rule } from './types.js';
import { useFetchRuleValues } from './use-fetch-rule-values.js';
import { useWatchParam } from './use-watch-param.js';

const STORAGE_KEY = 'p2tg_rule_values';

type RuleValuesCache = { [key: string]: OptionsType };

const loadingMessage = () => __('Loading...');
const noOptionsMessage = () => __('No options available');

export type RuleSetValuesProps = {
	rest_namespace: string;
	ruleset_name: string;
	rule: Rule;
};

export function RuleSetValues({
	rest_namespace,
	rule,
	ruleset_name,
}: RuleSetValuesProps) {
	const [isFetchingValues, setIsFetchingValues] = useState(false);
	const [defaultRuleValues, setDefaulRuleValues] = useState<OptionsType>([]);

	const fetchRuleValues = useFetchRuleValues(rest_namespace);
	const { getItem, setItem } = useLocalStorage<RuleValuesCache>(
		STORAGE_KEY,
		{},
		moduleStorage,
	);

	const { setValue } = useFormContext();
	const param = useWatchParam(ruleset_name);

	const previousParam = usePrevious(param);

	// biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
	useEffect(() => {
		// reset values if param changes
		if (previousParam && previousParam !== param) {
			setValue(`${ruleset_name}.values`, []);
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
						setDefaulRuleValues(result as OptionsType);
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
		(inputValue: string, callback: (result: OptionsType) => void) => {
			fetchRuleValues({
				param,
				search: inputValue,
				setInProgress: setIsFetchingValues,
				setResult: (result) => {
					callback(result as OptionsType);
				},
			});
		},
		[fetchRuleValues, param],
	);

	return (
		<FormField
			key={param}
			name={`${ruleset_name}.values`}
			defaultValue={rule.values}
			render={({ field }) => (
				<FormItem>
					<FormControl>
						<ReactAsyncSelect
							aria-label={__('Rule values')}
							closeMenuOnSelect={false}
							defaultOptions={defaultRuleValues}
							defaultValue={field.value}
							isLoading={isFetchingValues}
							isMulti
							loadOptions={loadValuesOptions}
							loadingMessage={loadingMessage}
							noOptionsMessage={noOptionsMessage}
							onChange={field.onChange}
							placeholder={
								isFetchingValues ? loadingMessage() : __('Select...')
							}
							value={field.value}
						/>
					</FormControl>
				</FormItem>
			)}
		/>
	);
}
