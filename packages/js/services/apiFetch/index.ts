import apiFetch from '@wordpress/api-fetch';
import type { APIFetchOptions } from '@wordpress/api-fetch';

import { __, sprintf } from '@wpsocio/i18n';

export const fetchAPI = {
	GET: async <T>(options: APIFetchOptions) => {
		return await apiFetch<T>({ method: 'GET', ...options });
	},
	POST: async <T>(options: APIFetchOptions) => {
		return await apiFetch<T>({ method: 'POST', ...options });
	},
	PUT: async <T>(options: APIFetchOptions) => {
		return await apiFetch<T>({ method: 'PUT', ...options });
	},
};

export const getErrorMessage = (error: unknown): string => {
	let result: string;
	if (error) {
		const {
			error_code, // From Telegram
			description,
			code, // From WP REST API
			message,
			// biome-ignore lint/suspicious/noExplicitAny: <explanation>
		} = (error || {}) as any;

		const errorCode = error_code || code;
		const errorMessage = description || message;

		result = errorCode
			? Number.isNaN(errorCode)
				? errorMessage
				: `${errorCode} (${errorMessage})`
			: __('Something went wrong');
	} else {
		result = __('Could not connect');
	}

	return sprintf('%s %s', __('Error:'), result);
};

export type { APIFetchOptions };

export * from './types';
