import { expect, test } from '@wordpress/e2e-test-utils-playwright';
import { Actions } from '../../utils/actions.js';
import { REST } from '../../utils/rest.js';

test.describe('Settings', () => {
	let actions: Actions;
	let rest: REST;

	test.beforeAll(async ({ requestUtils }) => {
		await requestUtils.activatePlugin('wp-telegram-comments');
		rest = new REST(requestUtils);
	});

	test.beforeEach(async ({ admin, page, pageUtils }) => {
		actions = new Actions(pageUtils);

		await rest.deleteOption('wptelegram_comments');
		await admin.visitAdminPage('admin.php', 'page=wptelegram_comments');
	});

	test.afterAll(async ({ requestUtils }) => {
		await requestUtils.deactivatePlugin('wp-telegram-comments');
		await rest.deleteOption('wptelegram_comments');
	});

	test('Should have instructions', async ({ page }) => {
		expect(await page.content()).toContain('INSTRUCTIONS!');
	});

	test('Should not allow submission without code', async ({ page }) => {
		const code = page.getByLabel('Code');

		const validationMessage = await code.evaluate((element) => {
			const input = element as HTMLTextAreaElement;
			return input.validationMessage;
		});

		expect(validationMessage).toBe('Please fill out this field.');

		// Should not show validation message before submission.
		expect(await page.content()).not.toContain('Code required');

		const saveButton = page.getByRole('button', { name: 'Save Changes' });

		await saveButton.click();

		// Press tab key to blur the code input to dismiss form validation tooltip.
		await page.keyboard.press('Tab');

		expect(await page.content()).toContain('Code required');
	});

	test('Should not allow submission with invalid code', async ({ page }) => {
		const code = page.getByLabel('Code');

		await code.selectText();

		await page.keyboard.type('invalid-code');

		// Press tab key to blur the code input to trigger validation.
		await page.keyboard.press('Tab');

		expect(await page.content()).toContain('Invalid Code');
	});

	test('Should save the changes', async ({ page }) => {
		await page.getByLabel('Code').selectText();

		await page.keyboard.type('<script async></script>');

		await actions.saveChangesAndWait({
			apiPath: 'wp-json/wptelegram-comments/v1/settings',
			assertSaved: true,
		});

		// Reload the page and wait
		await page.reload();

		const code = page.getByLabel('Code');

		code.waitFor();

		expect(await code.inputValue()).toBe('<script async></script>');
	});

	test('Should clean up the inputs', async ({ page }) => {
		await page.getByLabel('Code').selectText();

		await page.keyboard.type(
			'<script async unknown-attr="some-value"></script>',
		);

		await page.getByLabel('Exclude').selectText();

		await page.keyboard.type('1, 2, 3,invalid,');

		await actions.saveChangesAndWait({
			apiPath: 'wp-json/wptelegram-comments/v1/settings',
		});

		expect(await page.getByLabel('Code').inputValue()).toBe(
			'<script async></script>',
		);

		expect(await page.getByLabel('Exclude').inputValue()).toBe('1,2,3');
	});
});
