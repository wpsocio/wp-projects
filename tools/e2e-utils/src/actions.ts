import type { Locator, Page } from '@playwright/test';
import { type PageUtils, expect } from '@wordpress/e2e-test-utils-playwright';

export class Actions {
	protected page: Page;

	constructor(protected pageUtils: PageUtils) {
		this.page = pageUtils.page;
	}

	get saveChangesButton() {
		return this.page.getByRole('button', {
			name: 'Save Changes',
			exact: true,
		});
	}

	async saveChangesAndWait({
		apiPath,
		assertSaved = false,
	}: { apiPath: string; assertSaved?: boolean }) {
		await Promise.all([
			this.saveChangesButton.click(),
			this.waitForApiResponse(apiPath),
		]);

		if (assertSaved) {
			await this.assertChangesSaved();
		}
	}

	async waitForApiResponse(apiPath: string) {
		return await this.page.waitForResponse((resp) => {
			const url = resp.url();

			return (
				url.includes(apiPath) ||
				// API path can be URL encoded
				url.includes(encodeURIComponent(apiPath))
			);
		});
	}

	async testBotTokenAndWait({
		endpoint = '/wptelegram-bot/v1/getMe',
	}: { endpoint?: string } = {}) {
		const testButton = this.page.getByRole('button', {
			name: 'Test Token',
			exact: true,
		});

		return await Promise.all([
			testButton.click(),
			this.waitForApiResponse(endpoint),
		]);
	}

	async assertChangesSaved() {
		await this.assertNotification('success', 'Changes saved successfully.');
	}

	async assertNotification(status: 'success' | 'error', message: string) {
		const notifications = this.page.getByRole('region', {
			name: 'Notifications',
		});

		const notificationShown = notifications
			.locator('li[role="status"]', {
				has: this.page.locator(`div[data-status="${status}"]`),
			})
			.last();

		await notificationShown.waitFor();

		expect(await notificationShown.textContent()).toContain(message);
	}

	/**
	 * Selects an option from a dropdown for Radix UI
	 */
	async selectOption(trigger: Locator, option: string) {
		await trigger.click();

		await this.page
			.getByRole('listbox')
			.locator('div[data-radix-select-viewport][role="presentation"]')
			.getByRole('option', {
				name: option,
			})
			.click();
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
