import type { Page } from '@playwright/test';
import { expect } from '@wordpress/e2e-test-utils-playwright';

export class Actions {
	constructor(protected page: Page) {}

	async saveChangesAndWait({
		apiPath,
		assertSaved = false,
	}: { apiPath: string; assertSaved?: boolean }) {
		const saveButton = this.page.getByRole('button', { name: 'Save Changes' });

		await Promise.all([
			saveButton.click(),
			this.page.waitForResponse((resp) => resp.url().includes(apiPath)),
		]);

		if (assertSaved) {
			await this.assertChangesSaved();
		}
	}

	async assertChangesSaved() {
		const notifications = this.page.getByRole('region', {
			name: 'Notifications',
		});

		const notificationShown = notifications.getByRole('status');

		await notificationShown.waitFor();

		expect(await this.page.content()).toContain('Changes saved successfully.');
	}
}
