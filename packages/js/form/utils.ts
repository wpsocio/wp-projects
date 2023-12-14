import type { AnyObject } from '@wpsocio/utilities';

import type { FieldConditions } from './types';

/**
 * Parts of this function are copied from @eventespresso/form
 */
export const evaluateFieldConditions = (
	conditions: FieldConditions,
	formData: AnyObject,
	fieldName: string,
): boolean => {
	const getComplexKey = computeVariablePath(fieldName);

	const satisfied = conditions
		?.map(({ field, compare, value: val }) => {
			const complexKey = getComplexKey(field);

			const result = formData[complexKey];
			// biome-ignore lint/suspicious/noExplicitAny: <explanation>
			const value = val as any;

			switch (compare) {
				case '=':
					return result === value;
				case '!=':
					return result !== value;
				case '>':
					return result > value;
				case '>=':
					return result >= value;
				case '<':
					return result < value;
				case '<=':
					return result <= value;
				case 'EMPTY':
					return !result;
				case 'NOT_EMPTY':
					return result;
				case 'CONTAINS':
					return (
						(typeof result === 'string' || Array.isArray(result)) &&
						result.includes(value)
					);
				case 'NOT_CONTAINS':
					return (
						!(typeof result === 'string' || Array.isArray(result)) ||
						!result.includes(value)
					);
				case 'MATCHES':
					return new RegExp(value).test(`${result}`);
				case 'NOT_MATCHES':
					return !new RegExp(value).test(`${result}`);
				default:
					return false;
			}
		})
		?.filter(Boolean);

	// whether all conditions apply
	const conditionsApply = satisfied?.length === conditions?.length;

	return conditionsApply;
};

/**
 * Computes variable field path from a staic field path.
 * staticFieldName: "billing.addresses[1].phones[0].code"
 * variableFieldName: "billing.addresses[x].phones[x].number"
 *
 * result: "billing.addresses[1].phones[0].number"
 */
export const computeVariablePath =
	(staticFieldName: string) =>
	(variableFieldName: string): string => {
		/**
		 * The field can be inside a repeatable field/group.
		 * Thus staticFieldName can be "billing.addresses[1].phones[0].code"
		 * which means that it belongs to address at index 1 (in array of addresses)
		 * and phone at index 0 (in array of phones)
		 */
		const repeatableIndices = staticFieldName.match(/\[\d+?\]/g) || []; // ["[1]", "[0]"]

		let complexKey: string = variableFieldName;
		// field can be "billing.addresses[x].phones[x].country"
		const variableKeyRegex = /\[x\]/;
		if (variableKeyRegex.test(complexKey)) {
			for (const entry of repeatableIndices) {
				complexKey = complexKey.replace(variableKeyRegex, entry);
			}
			// replace any remaining variable indices with "0"
			complexKey = complexKey.replace(
				new RegExp(variableKeyRegex.source, 'g'),
				'[0]',
			);
		}
		return complexKey;
	};
