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
		await requestUtils.activatePlugin('wp-telegram-login');
		rest = new REST(requestUtils);
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
		const botToken = page.getByLabel('Bot Token');

		const validationMessage = await botToken.evaluate((element) => {
			const input = element as HTMLTextAreaElement;
			return input.validationMessage;
		});

		expect(validationMessage).toBe('Please fill out this field.');

		// Should not show validation message before submission.
		expect(await page.content()).not.toContain('Bot Token required');

		const saveButton = page.getByRole('button', { name: 'Save Changes' });

		await saveButton.click();

		await page.keyboard.press('Tab');

		expect(await page.content()).toContain('Bot Token required');

		await page.getByLabel('Bot Username').focus();

		await page.keyboard.press('Tab');

		expect(await page.content()).toContain('Bot Username required');

		await botToken.selectText();

		await page.keyboard.type('invalid-token');

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
				username: 'E2ETestBot',
			},
		};
		// Mock the api call
		await mocks.mockRequest(`bot${botToken}/getMe`, { json });

		const botTokenField = page.getByLabel('Bot Token');
		const botUsernameField = page.getByLabel('Bot Username');

		expect(await botUsernameField.inputValue()).toBe('');

		await botTokenField.selectText();

		await page.keyboard.type(botToken);

		const result = `${json.result.first_name} (@${json.result.username})`;

		expect(await page.content()).not.toContain(result);

		await actions.testBotTokenAndWait({ botToken });

		expect(await page.content()).toContain(result);

		expect(await botUsernameField.inputValue()).toBe(json.result.username);
	});

	test('Should handle the API call for invalid token', async ({ page }) => {
		const json = { ok: false, error_code: 401, description: 'Unauthorized' };

		// Mock the api call
		await mocks.mockRequest(`bot${botToken}/getMe`, {
			json,
			status: json.error_code,
		});

		const botTokenField = page.getByLabel('Bot Token');
		const botUsernameField = page.getByLabel('Bot Username');

		await botTokenField.selectText();

		await page.keyboard.type(botToken);

		const result = 'Error: 401 (Unauthorized)';

		expect(await page.content()).not.toContain(result);

		await actions.testBotTokenAndWait({ botToken });

		expect(await page.content()).toContain(result);

		expect(await botUsernameField.inputValue()).toBe('');
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
		const botTokenField = page.getByLabel('Bot Token');
		const botUsernameField = page.getByLabel('Bot Username');

		await botTokenField.selectText();

		await page.keyboard.type(botToken);

		await botUsernameField.dblclick();

		await page.keyboard.type('E2ETestBot');

		await actions.saveChangesAndWait({
			apiPath: 'wp-json/wptelegram-login/v1/settings',
			assertSaved: true,
		});

		// Reload the page and wait
		await page.reload();

		await botTokenField.waitFor();

		expect(await botTokenField.inputValue()).toBe(botToken);

		expect(await botUsernameField.inputValue()).toBe('E2ETestBot');
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
