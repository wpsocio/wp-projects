import { expect, test } from '@wordpress/e2e-test-utils-playwright';
import { Actions } from '../../utils/actions.js';
import { Mocks } from '../../utils/mocks.js';
import { REST } from '../../utils/rest.js';

test.describe('Settings', () => {
	let actions: Actions;
	let rest: REST;
	let mocks: Mocks;

	const botToken = '123456789:y7SdjUVdeSA8HRF3WmOqHAA-cOIiz9u04dC';

	test.beforeAll(async ({ requestUtils }) => {
		rest = new REST(requestUtils);
		await requestUtils.activatePlugin('wp-telegram-widget');
	});

	test.beforeEach(async ({ admin, pageUtils }) => {
		actions = new Actions(pageUtils);
		mocks = new Mocks(pageUtils);

		await rest.deleteOption('wptelegram_widget');
		await admin.visitAdminPage('admin.php', 'page=wptelegram_widget');
		await mocks.clearAllMocks();
	});

	test.afterAll(async ({ requestUtils }) => {
		await requestUtils.deactivatePlugin('wp-telegram-widget');
		await rest.deleteOption('wptelegram_widget');
	});

	test('Should save the settings without any changes', async ({ page }) => {
		const tabFields: Array<[string, Array<string>]> = [
			[
				'Ajax Widget',
				[
					//
					'Username',
					'Widget Width',
					'Widget Height',
				],
			],
			[
				'Legacy Widget',
				['Username', 'Bot Token', 'Widget Width', 'Number of Messages'],
			],
			[
				'Join Link',
				[
					'Channel Link',
					'Button text',
					'Background color',
					'Text color',
					'Priority',
					'Open in new tab',
				],
			],
		];

		// Let us touch all the fields and then save the settings
		for (const [tab, fields] of tabFields) {
			const button = page.getByRole('tab', { name: tab });

			await button.click();

			const buttonId = await button.getAttribute('id');

			// Get the tab panel that the button controls
			const tabPanel = page.locator(
				`div[role="tabpanel"][aria-labelledby="${buttonId}"]`,
			);

			for (const field of fields) {
				await tabPanel.getByLabel(field).focus();
			}
		}

		await actions.saveChangesAndWait({
			apiPath: '/wptelegram-widget/v1/settings',
			assertSaved: true,
		});
	});

	test('Should make the bot token required for legacy widget if username is set.', async ({
		page,
	}) => {
		const button = page.getByRole('tab', { name: 'Legacy Widget' });

		await button.click();
		const buttonId = await button.getAttribute('id');

		// Get the tab panel that the button controls
		const tabPanel = page.locator(
			`div[role="tabpanel"][aria-labelledby="${buttonId}"]`,
		);

		const botTokenField = tabPanel.getByLabel('Bot Token');

		let validationMessage = await botTokenField.evaluate(
			(el: HTMLInputElement) => el.validationMessage,
		);

		expect(validationMessage).toBeFalsy();

		await tabPanel.getByLabel('Username').fill('SomeUsername');

		validationMessage = await botTokenField.evaluate(
			(el: HTMLInputElement) => el.validationMessage,
		);

		expect(validationMessage).toBe('Please fill out this field.');

		await actions.saveChangesButton.click();

		await page.keyboard.press('Tab');

		expect(await page.content()).toContain('Bot Token required');

		await botTokenField.fill('invalid-token');

		await page.keyboard.press('Tab');

		expect(await page.content()).toContain('Invalid Bot Token');

		const testButton = page.getByRole('button', {
			name: 'Test Token',
			exact: true,
		});

		await expect(testButton).toBeDisabled();

		await botTokenField.fill(botToken);

		await page.keyboard.press('Tab');

		expect(await page.content()).not.toContain('Invalid Bot Token');

		await expect(testButton).toBeEnabled();

		await actions.saveChangesAndWait({
			apiPath: '/wptelegram-widget/v1/settings',
			assertSaved: true,
		});
	});
});
