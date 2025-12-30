import type { DataShape } from './types';

/**
 * Prepare default values from REST API schema
 */

// biome-ignore lint/suspicious/noExplicitAny: Any is fine here
export const prepDefaultValues = (data: any) => {
	const attributes = data.attributes ? JSON.stringify(data.attributes) : '';

	return { ...data, attributes };
};

/**
 * Normalizes form data for submission as per the REST schema
 */
export const normalizeData = (data: DataShape) => {
	const attributes = data.attributes ? JSON.parse(data.attributes) : {};

	return { ...data, attributes };
};
