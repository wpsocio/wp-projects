import type { RequestUtils } from '@wordpress/e2e-test-utils-playwright';

export class REST {
	constructor(protected requestUtils: RequestUtils) {}

	async deleteOption(option_name: string) {
		return await this.requestUtils.rest({
			method: 'DELETE',
			path: '/e2e-wp-rest/v1/option',
			data: {
				option_name,
			},
		});
	}
}
