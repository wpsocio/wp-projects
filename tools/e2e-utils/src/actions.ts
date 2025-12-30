import type { Locator, Page } from '@playwright/test';
import type { PageUtils } from '@wordpress/e2e-test-utils-playwright';

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
		endpoint,
		assertSaved = false,
	}: {
		endpoint: string;
		assertSaved?: boolean;
	}) {
		await Promise.all([
			this.saveChangesButton.click(),
			this.waitForApiResponse(endpoint),
		]);

		if (assertSaved) {
			await this.assertChangesSaved();
		}
	}

	async waitForApiResponse(
		endpoint: string,
		query: Record<string, string> = {},
	) {
		return await this.page.waitForResponse((resp) => {
			const url = new URL(resp.url());

			let isRestRoute = false;

			// If the URL contains the endpoint, it is a REST route.
			if (url.pathname.includes(endpoint)) {
				isRestRoute = true;
			}
			// If the URL contains /wp-json, it is a WP REST route with pretty permalinks.
			else if (url.pathname.startsWith('/wp-json')) {
				isRestRoute = url.pathname.includes(endpoint);
			}
			// If the URL contains rest_route query parameter, it is a WP REST route with ugly permalinks.
			else if (url.searchParams.has('rest_route')) {
				isRestRoute = Boolean(
					url.searchParams.get('rest_route')?.includes(endpoint),
				);
			}

			if (!isRestRoute) {
				return false;
			}

			for (const [key, value] of Object.entries(query)) {
				if (url.searchParams.get(key) !== value) {
					return false;
				}
			}

			return true;
		});
	}

	async testBotTokenAndWait({
		endpoint = '/wptelegram-bot/v1/base',
		query = { api_method: 'getMe' },
	}: {
		endpoint?: string;
		query?: Record<string, string>;
	} = {}) {
		const testButton = this.page.getByRole('button', {
			name: 'Test Token',
			exact: true,
		});

		return await Promise.all([
			testButton.click(),
			this.waitForApiResponse(endpoint, query),
		]);
	}

	async assertChangesSaved() {
		await this.assertNotification('success', 'Changes saved successfully.');
	}

	async assertNotification(status: 'success' | 'error', message: string) {
		const notifications = this.page.locator('section[aria-live="polite"]');

		const notificationShown = notifications.locator(
			`li[data-type="${status}"]`,
			{
				hasText: message,
			},
		);

		await notificationShown.waitFor();
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
}
