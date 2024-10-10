import type { Page, Route } from '@playwright/test';
import type { PageUtils } from '@wordpress/e2e-test-utils-playwright';

export class Mocks {
	protected page: Page;

	constructor(protected pageUtils: PageUtils) {
		this.page = pageUtils.page;
	}

	async mockRequest(
		urlSubstr: string,
		options: Parameters<Route['fulfill']>[0],
	) {
		const predicate = (url: URL) => url.pathname.includes(urlSubstr);
		const handler = async (route: Route) => await route.fulfill(options);

		await this.page.route(predicate, handler);

		return () => {
			this.page.unroute(predicate, handler);
		};
	}

	async clearAllMocks() {
		await this.page.unrouteAll();
	}
}
