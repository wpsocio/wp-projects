import type { FrameLocator } from '@playwright/test';
import { expect, test } from '@wordpress/e2e-test-utils-playwright';
import { Actions, IframedWPAdmin, Mocks, REST } from '@wpsocio/e2e-utils';
import { TEST_BOT_TOKEN, TEST_BOT_USERNAME } from '../../utils/constants.js';

test.describe('Settings', () => {
	let actions: Actions;
	let rest: REST;
	let mocks: Mocks;
	let iframe: FrameLocator;

	test.beforeAll(async ({ requestUtils }) => {
		rest = new REST(requestUtils);
		await requestUtils.activatePlugin('wp-telegram-login');
	});

	test.beforeEach(async ({ admin, pageUtils }) => {
		actions = new Actions(pageUtils);
		mocks = new Mocks(pageUtils);
		iframe = new IframedWPAdmin(pageUtils).contentFrame();

		await rest.deleteOption('wptelegram_login');
		await admin.visitAdminPage('admin.php', 'page=wptelegram_login');
		await mocks.clearAllMocks();
	});

	test.afterAll(async ({ requestUtils }) => {
		await requestUtils.deactivatePlugin('wp-telegram-login');
		await rest.deleteOption('wptelegram_login');
	});

	test('Should have instructions', async () => {
		await expect(iframe.locator('body')).toContainText('INSTRUCTIONS!');
	});

	test('Should validate the bot token and username inputs', async ({
		page,
	}) => {
		const botTokenField = iframe.getByLabel('Bot Token');

		const validationMessage = await botTokenField.evaluate(
			(el: HTMLInputElement) => el.validationMessage,
		);

		expect(validationMessage).toBe('Please fill out this field.');

		// Should not show validation message before submission.
		await expect(iframe.locator('body')).not.toContainText(
			'Bot Token required',
		);

		await actions.saveChangesButton.click();

		await page.keyboard.press('Tab');

		await expect(iframe.locator('body')).toContainText('Bot Token required');

		await iframe.getByLabel('Bot Username').focus();

		await page.keyboard.press('Tab');

		await expect(iframe.locator('body')).toContainText('Bot Username required');

		await botTokenField.fill('invalid-token');

		const testButton = iframe.getByRole('button', {
			name: 'Test Token',
			exact: true,
		});

		await expect(testButton).toBeDisabled();
	});

	test('Should validate the bot token from API and fill username', async () => {
		const json = {
			ok: true,
			result: {
				id: 123,
				first_name: 'The E2E Test Bot',
				username: TEST_BOT_USERNAME,
			},
		};
		// Mock the api call
		const unmock = await mocks.mockRequest(`bot${TEST_BOT_TOKEN}/getMe`, {
			json,
		});

		const botTokenField = iframe.getByLabel('Bot Token');
		const botUsernameField = iframe.getByLabel('Bot Username');

		await expect(botUsernameField).toHaveValue('');

		await botTokenField.fill(TEST_BOT_TOKEN);

		const resultAlert = iframe
			.getByRole('alert')
			.filter({ has: iframe.getByRole('heading', { name: 'Test Result:' }) });

		const result = `${json.result.first_name} (@${json.result.username})`;

		await expect(resultAlert).toHaveCount(0);

		await actions.testBotTokenAndWait({
			endpoint: `/bot${TEST_BOT_TOKEN}/getMe`,
			query: {},
		});

		await resultAlert.waitFor();

		await expect(resultAlert).toContainText(result);
		await expect(botUsernameField).toHaveValue(json.result.username);

		await unmock();
	});

	test('Should handle the API call for invalid token', async () => {
		const json = { ok: false, error_code: 401, description: 'Unauthorized' };

		// Mock the api call
		const unmock = await mocks.mockRequest(`bot${TEST_BOT_TOKEN}/getMe`, {
			json,
			status: json.error_code,
		});

		const botTokenField = iframe.getByLabel('Bot Token');
		const botUsernameField = iframe.getByLabel('Bot Username');

		await botTokenField.fill(TEST_BOT_TOKEN);

		const resultAlert = iframe
			.getByRole('alert')
			.filter({ has: iframe.getByRole('heading', { name: 'Test Result:' }) });

		const result = 'Error: 401 (Unauthorized)';

		await expect(resultAlert).toHaveCount(0);

		await actions.testBotTokenAndWait({
			endpoint: `/bot${TEST_BOT_TOKEN}/getMe`,
			query: {},
		});

		await resultAlert.waitFor();

		await expect(resultAlert).toContainText(result);

		await expect(botUsernameField).toHaveValue('');

		await unmock();
	});

	test('That the bot username field is readonly by default', async () => {
		const botUsernameField = iframe.getByLabel('Bot Username');

		await expect(botUsernameField).toHaveAttribute('readonly');

		await botUsernameField.dblclick();

		await expect(botUsernameField).not.toHaveAttribute('readonly');
	});

	test('Should save the changes with only bot token and username', async ({
		page,
	}) => {
		let botTokenField = iframe.getByLabel('Bot Token');
		let botUsernameField = iframe.getByLabel('Bot Username');

		await botTokenField.fill(TEST_BOT_TOKEN);

		await botUsernameField.dblclick();
		await botUsernameField.fill(TEST_BOT_USERNAME);

		await actions.saveChangesAndWait({
			endpoint: '/wptelegram-login/v1/settings',
			assertSaved: true,
		});

		// Reload the page and wait
		await page.reload();

		botTokenField = iframe.getByLabel('Bot Token');
		botUsernameField = iframe.getByLabel('Bot Username');

		await botTokenField.waitFor();

		await expect(botTokenField).toHaveValue(TEST_BOT_TOKEN);
		await expect(botUsernameField).toHaveValue(TEST_BOT_USERNAME);
	});

	test('Should display fields conditionally', async () => {
		// Fields that depend on the "Disable Sign up" checkbox
		const userRoleField = iframe.getByLabel('User Role');
		const randomEmailField = iframe.getByLabel('Random Email');
		const disableSignUpField = iframe.getByLabel('Disable Sign up');

		await expect(userRoleField).toBeVisible();
		await expect(randomEmailField).toBeVisible();

		await disableSignUpField.check({ force: true });

		await expect(userRoleField).not.toBeVisible();
		await expect(randomEmailField).not.toBeVisible();

		// Fields that depend on the "Custom URL" radio
		const customUrlField = iframe.getByRole('textbox', { name: 'Custom URL' });

		await expect(customUrlField).not.toBeVisible();

		const customUrlRadio = iframe.getByRole('radio', { name: 'Custom URL' });

		await customUrlRadio.check({ force: true });

		await expect(customUrlField).toBeVisible();

		// Fields that depend on the "Show error message" option
		const showErrorMessageField = iframe.getByLabel('Show error message');
		const errorMessageTextField = iframe.getByRole('textbox', {
			name: 'Error message text',
		});

		await expect(errorMessageTextField).not.toBeVisible();

		await showErrorMessageField.check({ force: true });

		await expect(errorMessageTextField).toBeVisible();
	});
});
