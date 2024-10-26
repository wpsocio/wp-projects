import { expect, test } from '@wordpress/e2e-test-utils-playwright';
import { Actions, Mocks, REST } from '@wpsocio/e2e-utils';
import { TEST_BOT_TOKEN, TEST_BOT_USERNAME } from '../../utils/constants.js';

test.describe('Settings', () => {
	let actions: Actions;
	let rest: REST;
	let mocks: Mocks;

	test.beforeAll(async ({ requestUtils }) => {
		rest = new REST(requestUtils);
		await requestUtils.activatePlugin('wp-telegram-login');
	});

	test.beforeEach(async ({ admin, pageUtils }) => {
		actions = new Actions(pageUtils);
		mocks = new Mocks(pageUtils);

		await rest.deleteOption('wptelegram_login');
		await admin.visitAdminPage('admin.php', 'page=wptelegram_login');
		await mocks.clearAllMocks();
	});

	test.afterAll(async ({ requestUtils }) => {
		await requestUtils.deactivatePlugin('wp-telegram-login');
		await rest.deleteOption('wptelegram_login');
	});

	test('Should have instructions', async ({ page }) => {
		expect(await page.content()).toContain('INSTRUCTIONS!');
	});

	test('Should validate the bot token and username inputs', async ({
		page,
	}) => {
		const botTokenField = page.getByLabel('Bot Token');

		const validationMessage = await botTokenField.evaluate(
			(el: HTMLInputElement) => el.validationMessage,
		);

		expect(validationMessage).toBe('Please fill out this field.');

		// Should not show validation message before submission.
		expect(await page.content()).not.toContain('Bot Token required');

		await actions.saveChangesButton.click();

		await page.keyboard.press('Tab');

		expect(await page.content()).toContain('Bot Token required');

		await page.getByLabel('Bot Username').focus();

		await page.keyboard.press('Tab');

		expect(await page.content()).toContain('Bot Username required');

		await botTokenField.fill('invalid-token');

		const testButton = page.getByRole('button', {
			name: 'Test Token',
			exact: true,
		});

		await expect(testButton).toBeDisabled();
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
		const unmock = await mocks.mockRequest(`bot${TEST_BOT_TOKEN}/getMe`, {
			json,
		});

		const botTokenField = page.getByLabel('Bot Token');
		const botUsernameField = page.getByLabel('Bot Username');

		expect(await botUsernameField.inputValue()).toBe('');

		await botTokenField.fill(TEST_BOT_TOKEN);

		const resultAlert = page
			.getByRole('alert')
			.filter({ has: page.getByRole('heading', { name: 'Test Result:' }) });

		const result = `${json.result.first_name} (@${json.result.username})`;

		expect(await resultAlert.count()).toBe(0);

		await actions.testBotTokenAndWait({
			endpoint: `/bot${TEST_BOT_TOKEN}/getMe`,
		});

		await resultAlert.waitFor();

		expect(await resultAlert.textContent()).toContain(result);
		expect(await botUsernameField.inputValue()).toBe(json.result.username);

		await unmock();
	});

	test('Should handle the API call for invalid token', async ({ page }) => {
		const json = { ok: false, error_code: 401, description: 'Unauthorized' };

		// Mock the api call
		const unmock = await mocks.mockRequest(`bot${TEST_BOT_TOKEN}/getMe`, {
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

		expect(await resultAlert.count()).toBe(0);

		await actions.testBotTokenAndWait({
			endpoint: `/bot${TEST_BOT_TOKEN}/getMe`,
		});

		await resultAlert.waitFor();

		expect(await resultAlert.textContent()).toContain(result);

		expect(await botUsernameField.inputValue()).toBe('');

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

	test('Should save the changes with only bot token and username', async ({
		page,
	}) => {
		let botTokenField = page.getByLabel('Bot Token');
		let botUsernameField = page.getByLabel('Bot Username');

		await botTokenField.fill(TEST_BOT_TOKEN);

		await botUsernameField.dblclick();
		await botUsernameField.fill(TEST_BOT_USERNAME);

		await actions.saveChangesAndWait({
			apiPath: '/wptelegram-login/v1/settings',
			assertSaved: true,
		});

		// Reload the page and wait
		await page.reload();

		botTokenField = page.getByLabel('Bot Token');
		botUsernameField = page.getByLabel('Bot Username');

		await botTokenField.waitFor();

		expect(await botTokenField.inputValue()).toBe(TEST_BOT_TOKEN);
		expect(await botUsernameField.inputValue()).toBe(TEST_BOT_USERNAME);
	});

	test('Should display fields conditionally', async ({ page }) => {
		// Fields that depend on the "Disable Sign up" checkbox
		const userRoleFiel = page.getByLabel('User Role');
		const randomEmailField = page.getByLabel('Random Email');
		const disableSignUpField = page.getByLabel('Disable Sign up');

		await expect(userRoleFiel).toBeVisible();
		await expect(randomEmailField).toBeVisible();

		await disableSignUpField.check({ force: true });

		await expect(userRoleFiel).not.toBeVisible();
		await expect(randomEmailField).not.toBeVisible();

		// Fields that depend on the "Custom URL" radio
		const customUrlField = page.getByRole('textbox', { name: 'Custom URL' });

		await expect(customUrlField).not.toBeVisible();

		const customUrlRadio = page.getByRole('radio', { name: 'Custom URL' });

		await customUrlRadio.check({ force: true });

		await expect(customUrlField).toBeVisible();

		// Fields that depend on the "Show error message" option
		const showErrorMessageField = page.getByLabel('Show error message');
		const errorMessageTextField = page.getByRole('textbox', {
			name: 'Error message text',
		});

		await expect(errorMessageTextField).not.toBeVisible();

		await showErrorMessageField.check({ force: true });

		await expect(errorMessageTextField).toBeVisible();
	});
});
