import { useFormContext, useWatch } from '@wpsocio/form';
import { strToPath } from '@wpsocio/utilities/misc.js';
import { pathOr } from 'ramda';

export const useWatchParam = (ruleSetName: string): string => {
	const { getValues } = useFormContext();

	const name = `${ruleSetName}.param`;

	const defaultValue = pathOr('post', strToPath(name), getValues());

	const param = useWatch({ name: `${ruleSetName}.param`, defaultValue });

	return param;
};
