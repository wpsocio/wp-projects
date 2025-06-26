import type { Page } from '@playwright/test';
import type { PageUtils } from '@wordpress/e2e-test-utils-playwright';

export class IframedWPAdmin {
	#iframeSelector = '#wpsocio-iframed-wp-admin-root iframe';

	protected page: Page;

	constructor(protected pageUtils: PageUtils) {
		this.page = pageUtils.page;
	}

	contentFrame() {
		return this.page.locator(this.#iframeSelector).first().contentFrame();
	}
}
