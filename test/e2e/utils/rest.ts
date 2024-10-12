import type { RequestUtils } from '@wordpress/e2e-test-utils-playwright';
import type { Theme } from './types.js';

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

	async getInstalledThemes() {
		return await this.requestUtils.rest<Array<Theme>>({
			path: '/wp/v2/themes',
		});
	}

	async getActiveTheme() {
		const themes = await this.getInstalledThemes();

		return themes.find((theme) => theme.status === 'active');
	}
}
