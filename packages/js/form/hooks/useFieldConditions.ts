import { pluck, zipObj } from 'ramda';
import { useMemo } from 'react';
import { useFormContext } from 'react-hook-form';

import type { FieldConditions } from '../types';
import { computeVariablePath, evaluateFieldConditions } from '../utils';

export const useFieldConditions = (
	fieldName: string,
	conditions: FieldConditions,
) => {
	const fields = useMemo(() => {
		const getComplexKey = computeVariablePath(fieldName);
		return pluck('field', conditions || []).map(getComplexKey);
	}, [conditions, fieldName]);

	const { watch } = useFormContext();

	let formData: Array<{ [k: string]: string }> | undefined;

	if (conditions) {
		formData = watch(fields);
	}

	return useMemo<boolean>(() => {
		if (!formData) {
			return true;
		}
		// (['a', 'b', 'c'], [1, 2, 3]); //=> {a: 1, b: 2, c: 3}
		const formDataObject = zipObj(fields, formData);

		return evaluateFieldConditions(conditions, formDataObject, fieldName);
	}, [conditions, fieldName, fields, formData]);
};
