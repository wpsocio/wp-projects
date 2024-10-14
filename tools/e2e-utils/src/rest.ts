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

	/**
	 * Delete all CPT posts using REST API.
	 *
	 * @param endpoint The endpoint to delete posts, e.g. "/wp/v2/posts".
	 */
	async deleteAllCPTPosts(endpoint: string) {
		// List all posts.
		const posts = await this.requestUtils.rest({
			path: endpoint,
			params: {
				per_page: 100,
				// All possible statuses.
				status: 'publish,future,draft,pending,private,trash',
			},
		});

		// Delete all posts one by one.
		await Promise.all(
			posts.map((post: { id: number }) =>
				this.requestUtils.rest({
					method: 'DELETE',
					path: `${endpoint}/${post.id}`,
					params: {
						force: true,
					},
				}),
			),
		);
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
