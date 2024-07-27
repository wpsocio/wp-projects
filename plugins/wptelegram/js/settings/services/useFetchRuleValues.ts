import { useCallback } from 'react';

import type { OptionsType } from '@wpsocio/adapters';
import { type BaseApiUtilArgs, fetchAPI } from '@wpsocio/services';
import { useData } from './useData';

interface FetchRuleValuesArgs extends BaseApiUtilArgs {
	param: string;
	search?: string;
}

export type FetchRuleValues = (
	args: FetchRuleValuesArgs,
) => Promise<OptionsType>;

export const useFetchRuleValues = (): FetchRuleValues => {
	const { rest_namespace } = useData('api');

	const path = `${rest_namespace}/p2tg-rules`;

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
