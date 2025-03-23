import { type BaseApiUtilArgs, fetchAPI } from '@wpsocio/services/api-fetch';
import type { OptionsType } from '@wpsocio/ui/wrappers/types';
import { useCallback } from 'react';
import { getDomData } from './getDomData';

interface FetchRuleValuesArgs extends BaseApiUtilArgs {
	param: string;
	search?: string;
}

export type FetchRuleValues = (
	args: FetchRuleValuesArgs,
) => Promise<OptionsType>;

export const useFetchRuleValues = (): FetchRuleValues => {
	return useCallback(async (args) => {
		const { rest_namespace } = getDomData('api');

		const path = `${rest_namespace}/p2tg-rules`;
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
	}, []);
};
