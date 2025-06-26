import type { FrameLocator } from '@playwright/test';
import { expect, test } from '@wordpress/e2e-test-utils-playwright';
import { Actions, IframedWPAdmin, Mocks, REST } from '@wpsocio/e2e-utils';
import { TEST_BOT_TOKEN } from '../../utils/constants.js';

test.describe('Settings', () => {
	let actions: Actions;
	let rest: REST;
	let mocks: Mocks;
	let iframe: FrameLocator;

	test.beforeAll(async ({ requestUtils }) => {
		rest = new REST(requestUtils);
		await requestUtils.activatePlugin('wp-telegram-widget');
	});

	test.beforeEach(async ({ admin, pageUtils }) => {
		actions = new Actions(pageUtils);
		mocks = new Mocks(pageUtils);
		iframe = new IframedWPAdmin(pageUtils).contentFrame();

		await rest.deleteOption('wptelegram_widget');
		await admin.visitAdminPage('admin.php', 'page=wptelegram_widget');
		await mocks.clearAllMocks();
	});

	test.afterAll(async ({ requestUtils }) => {
		await requestUtils.deactivatePlugin('wp-telegram-widget');
		await rest.deleteOption('wptelegram_widget');
	});

	test('Should save the settings without any changes', async () => {
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
			const button = iframe.getByRole('tab', { name: tab });

			await button.click();

			const buttonId = await button.getAttribute('id');

			// Get the tab panel that the button controls
			const tabPanel = iframe.locator(
				`div[role="tabpanel"][aria-labelledby="${buttonId}"]`,
			);

			for (const field of fields) {
				await tabPanel.getByLabel(field).focus();
			}
		}

		await actions.saveChangesAndWait({
			endpoint: '/wptelegram-widget/v1/settings',
			assertSaved: true,
		});
	});

	test('Should make the bot token required for legacy widget if username is set.', async ({
		page,
	}) => {
		const button = iframe.getByRole('tab', { name: 'Legacy Widget' });

		await button.click();
		const buttonId = await button.getAttribute('id');

		// Get the tab panel that the button controls
		const tabPanel = iframe.locator(
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

		await expect(iframe.locator('body')).toContainText('Bot Token required');

		await botTokenField.fill('invalid-token');

		await page.keyboard.press('Tab');

		await expect(iframe.locator('body')).toContainText('Invalid Bot Token');

		const testButton = iframe.getByRole('button', {
			name: 'Test Token',
			exact: true,
		});

		await expect(testButton).toBeDisabled();

		await botTokenField.fill(TEST_BOT_TOKEN);

		await page.keyboard.press('Tab');

		await expect(iframe.locator('body')).not.toContainText('Invalid Bot Token');

		await expect(testButton).toBeEnabled();

		await actions.saveChangesAndWait({
			endpoint: '/wptelegram-widget/v1/settings',
			assertSaved: true,
		});
	});
});
