import type { Page } from '@playwright/test';
import { type PageUtils, expect } from '@wordpress/e2e-test-utils-playwright';

export class Actions {
	protected page: Page;

	constructor(protected pageUtils: PageUtils) {
		this.page = pageUtils.page;
	}

	async saveChangesAndWait({
		apiPath,
		assertSaved = false,
	}: { apiPath: string; assertSaved?: boolean }) {
		const saveButton = this.page.getByRole('button', {
			name: 'Save Changes',
			exact: true,
		});

		await Promise.all([
			saveButton.click(),
			this.page.waitForResponse((resp) => {
				const url = resp.url();

				return (
					url.includes(apiPath) ||
					// API path can be encoded in the URL as `rest_route`.
					url.includes(encodeURIComponent(apiPath))
				);
			}),
		]);

		if (assertSaved) {
			await this.assertChangesSaved();
		}
	}

	async testBotTokenAndWait({ botToken }: { botToken: string }) {
		const apiPath = `/bot${botToken}/getMe`;

		const testButton = this.page.getByRole('button', {
			name: 'Test Token',
			exact: true,
		});

		return await Promise.all([
			testButton.click(),
			this.page.waitForResponse((resp) => resp.url().includes(apiPath)),
		]);
	}

	async assertChangesSaved() {
		const notifications = this.page.getByRole('region', {
			name: 'Notifications',
		});

		const notificationShown = notifications.getByRole('status');

		await notificationShown.waitFor();

		expect(await this.page.content()).toContain('Changes saved successfully.');
	}

	async logout() {
		// If it is logged and in a page different than the dashboard,
		// move to the dashboard. Some pages may be in full-screen mode,
		// so they won't have the log-out button available.
		if (
			!this.pageUtils.isCurrentURL('wp-login.php') &&
			!this.pageUtils.isCurrentURL('wp-admin')
		) {
			await this.page.goto('wp-admin');
		}

		await Promise.all([
			this.page.hover('#wp-admin-bar-my-account'),
			this.page.waitForSelector('#wp-admin-bar-logout', {
				state: 'visible',
			}),
		]);

		await this.page.click('#wp-admin-bar-logout');
	}
}
