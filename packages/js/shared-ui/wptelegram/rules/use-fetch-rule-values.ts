import { fetchAPI } from '@wpsocio/services/api-fetch';
import type { BaseApiUtilArgs } from '@wpsocio/services/api-fetch/types.js';
import type { OptionsType } from '@wpsocio/ui-components/wrappers/types.js';
import { useCallback } from 'react';

interface FetchRuleValuesArgs extends BaseApiUtilArgs {
	param: string;
	search?: string;
}

export type FetchRuleValues = (
	args: FetchRuleValuesArgs,
) => Promise<OptionsType>;

export const useFetchRuleValues = (rest_namespace: string): FetchRuleValues => {
	const path = `${rest_namespace}/p2tg-rules/`;

	return useCallback(
		async (args) => {
			const { setInProgress, setResult, param, search } = args;

			setInProgress?.(true);

			try {
				// convert params to URL query string
				const urlParams = new URLSearchParams({ param, search: search || '' });
				const pathWithParams = `${path}?${urlParams.toString()}`;

				const result = await fetchAPI.GET<OptionsType>({
					path: pathWithParams,
				});

				setResult?.(result);

				return result;
			} catch (error) {
				// biome-ignore lint/suspicious/noConsoleLog: <explanation>
				console.log('ERROR', error);

				setResult?.([]);

				return [];
			} finally {
				setInProgress?.(false);
			}
		},
		[path],
	);
};
