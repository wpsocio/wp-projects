import { expect, test } from '@wordpress/e2e-test-utils-playwright';
import { Actions, Mocks, REST } from '@wpsocio/e2e-utils';
import { TEST_BOT_TOKEN, TEST_BOT_USERNAME } from '../../utils/constants.js';

test.describe('Settings', () => {
	let actions: Actions;
	let rest: REST;
	let mocks: Mocks;

	test.beforeAll(async ({ requestUtils }) => {
		rest = new REST(requestUtils);
		await requestUtils.activatePlugin('wp-telegram');
	});

	test.beforeEach(async ({ admin, pageUtils }) => {
		actions = new Actions(pageUtils);
		mocks = new Mocks(pageUtils);

		await rest.deleteOption('wptelegram');
		await admin.visitAdminPage('admin.php', 'page=wptelegram');
	});

	test.afterAll(async ({ requestUtils }) => {
		await requestUtils.deactivatePlugin('wp-telegram');
		await rest.deleteOption('wptelegram');
	});

	test('Should have instructions', async ({ page }) => {
		await expect(page.locator('body')).toContainText('INSTRUCTIONS!');
	});

	test('Should not allow submission without bot token or username', async ({
		page,
	}) => {
		const botTokenField = page.getByLabel('Bot Token');

		const validationMessage = await botTokenField.evaluate(
			(el: HTMLInputElement) => el.validationMessage,
		);

		expect(validationMessage).toBe('Please fill out this field.');

		// Should not show validation message before submission.
		await expect(page.locator('body')).not.toContainText('Bot Token required');
		await expect(page.locator('body')).not.toContainText(
			'Bot Username required',
		);

		await actions.saveChangesButton.click();

		// Press tab key to blur the code input to dismiss form validation tooltip.
		await page.keyboard.press('Tab');
		await page.keyboard.press('Tab');

		await expect(page.locator('body')).toContainText('Bot Token required');
		await expect(page.locator('body')).toContainText('Bot Token required');
		await expect(page.locator('body')).toContainText('Bot Username required');
	});

	test('Should not allow submission with invalid bot token', async ({
		page,
	}) => {
		const code = page.getByLabel('Bot Token');

		await code.fill('invalid-token');

		// Press tab key to blur the code input to trigger validation.
		await page.keyboard.press('Tab');

		await expect(page.locator('body')).toContainText('Invalid Bot Token');
	});

	test('Should save the changes', async ({ page }) => {
		await page.getByLabel('Bot Token').fill(TEST_BOT_TOKEN);
		const botUsernameField = page.getByLabel('Bot Username');
		await botUsernameField.dblclick();
		await botUsernameField.fill(TEST_BOT_USERNAME);

		await actions.saveChangesAndWait({
			endpoint: '/wptelegram/v1/settings',
			assertSaved: true,
		});

		// Reload the page and wait
		await page.reload();

		const botTokenField = page.getByLabel('Bot Token');

		await botTokenField.waitFor();

		await expect(botTokenField).toHaveValue(TEST_BOT_TOKEN);
		await expect(page.getByLabel('Bot Username')).toHaveValue(
			TEST_BOT_USERNAME,
		);
	});

	test('Should validate the bot token from API and fill username', async ({
		page,
	}) => {
		const json = {
			ok: true,
			result: {
				id: 123,
				first_name: 'The E2E Test Bot',
				username: TEST_BOT_USERNAME,
			},
		};
		// Mock the api call
		const unmock = await mocks.mockRequest('/wptelegram-bot/v1/base', {
			json,
		});

		const botTokenField = page.getByLabel('Bot Token');
		const botUsernameField = page.getByLabel('Bot Username');

		await expect(botUsernameField).toHaveValue('');

		await botTokenField.fill(TEST_BOT_TOKEN);

		const resultAlert = page
			.getByRole('alert')
			.filter({ has: page.getByRole('heading', { name: 'Test Result:' }) });

		const result = `${json.result.first_name} (@${json.result.username})`;

		await expect(resultAlert).toHaveCount(0);

		await actions.testBotTokenAndWait();

		await resultAlert.waitFor();

		await expect(resultAlert).toContainText(result);

		await expect(botUsernameField).toHaveValue(json.result.username);

		await unmock();
	});

	test('Should handle the API call for invalid token', async ({ page }) => {
		const json = { ok: false, error_code: 401, description: 'Unauthorized' };

		// Mock the api call
		const unmock = await mocks.mockRequest('/wptelegram-bot/v1/base', {
			json,
			status: json.error_code,
		});

		const botTokenField = page.getByLabel('Bot Token');
		const botUsernameField = page.getByLabel('Bot Username');

		await botTokenField.fill(TEST_BOT_TOKEN);

		const resultAlert = page
			.getByRole('alert')
			.filter({ has: page.getByRole('heading', { name: 'Test Result:' }) });

		const result = 'Error: 401 (Unauthorized)';

		await expect(resultAlert).toHaveCount(0);

		await actions.testBotTokenAndWait();

		await resultAlert.waitFor();

		await expect(resultAlert).toContainText(result);

		await expect(botUsernameField).toHaveValue('');

		await unmock();
	});

	test('That the bot username field is readonly by default', async ({
		page,
	}) => {
		const botUsernameField = page.getByLabel('Bot Username');

		await expect(botUsernameField).toHaveAttribute('readonly');

		await botUsernameField.dblclick();

		await expect(botUsernameField).not.toHaveAttribute('readonly');
	});

	test('Should hide the fields for sections that require bot token', async ({
		page,
	}) => {
		const tabFields: Array<[tabName: string, fields: Array<string>]> = [
			['Post to Telegram', ['Message Template']],
			['Private Notifications', ['Message Template']],
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

			// Now let us activate the section
			await tabPanel
				.getByRole('switch', { name: 'Active' })
				.check({ force: true });

			// Assert that fields are not visible
			for (const field of fields) {
				await expect(tabPanel.getByLabel(field)).toHaveCount(0);
			}
		}
	});

	test('Should not allow saving the active sections with required fields', async ({
		page,
	}) => {
		await page.getByLabel('Bot Token').fill(TEST_BOT_TOKEN);
		const botUsernameField = page.getByLabel('Bot Username');
		await botUsernameField.dblclick();
		await botUsernameField.fill(TEST_BOT_USERNAME);

		const button = page.getByRole('tab', { name: 'Post to Telegram' });

		await button.click();

		const buttonId = await button.getAttribute('id');

		// Get the tab panel that the button controls
		const tabPanel = page.locator(
			`div[role="tabpanel"][aria-labelledby="${buttonId}"]`,
		);

		// Now let us activate the section
		await tabPanel
			.getByRole('switch', { name: 'Active' })
			.check({ force: true });

		await actions.saveChangesButton.click();

		await expect(tabPanel).toContainText('At least one channel is required.');

		await tabPanel.getByRole('button', { name: 'Add channel' }).click();

		await tabPanel.getByPlaceholder('@username').fill('@WPTelegram');

		await actions.saveChangesAndWait({
			endpoint: '/wptelegram/v1/settings',
			assertSaved: true,
		});
	});

	test('Should display proxy options conditionally', async ({ page }) => {
		await page.getByLabel('Bot Token').fill(TEST_BOT_TOKEN);

		const button = page.getByRole('tab', { name: 'Proxy' });

		await button.click();

		const buttonId = await button.getAttribute('id');

		// Get the tab panel that the button controls
		const tabPanel = page.locator(
			`div[role="tabpanel"][aria-labelledby="${buttonId}"]`,
		);

		// Now let us activate the section
		await tabPanel
			.getByRole('switch', { name: 'Active' })
			.check({ force: true });

		// Cloudflare proxy should be checked by default
		await expect(
			tabPanel.getByRole('radio', { name: 'Cloudflare worker' }),
		).toBeChecked();
		await expect(
			tabPanel.getByRole('textbox', { name: 'Cloudflare worker URL' }),
		).toBeVisible();
		await expect(
			tabPanel.getByRole('textbox', { name: 'Google Script URL' }),
		).toHaveCount(0);

		// Let us change the proxy type to "Google Script"
		await tabPanel.getByRole('radio', { name: 'Google Script' }).check({
			force: true,
		});
		await expect(
			tabPanel.getByRole('textbox', { name: 'Google Script URL' }),
		).toBeVisible();
		await expect(
			tabPanel.getByRole('textbox', { name: 'Cloudflare worker URL' }),
		).toHaveCount(0);

		// Let us change the proxy type to "PHP Proxy"
		await tabPanel.getByRole('radio', { name: 'PHP Proxy' }).check({
			force: true,
		});
		await expect(
			tabPanel.getByRole('textbox', { name: 'Proxy Host' }),
		).toBeVisible();
		await expect(
			tabPanel.getByRole('textbox', { name: 'Google Script URL' }),
		).toHaveCount(0);

		const proxyFields = ['Proxy Host', 'Proxy Port', 'Username', 'Password'];

		// Let us touch all the fields and then save the settings
		for (const field of proxyFields) {
			await tabPanel.getByLabel(field).focus();
		}
	});
});
