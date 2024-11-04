import { expect, test } from '@wordpress/e2e-test-utils-playwright';
import { Actions, REST } from '@wpsocio/e2e-utils';

test.describe('Settings', () => {
	let actions: Actions;
	let rest: REST;

	test.beforeAll(async ({ requestUtils }) => {
		rest = new REST(requestUtils);
		await requestUtils.activatePlugin('wp-telegram-comments');
	});

	test.beforeEach(async ({ admin, pageUtils }) => {
		actions = new Actions(pageUtils);

		await rest.deleteOption('wptelegram_comments');
		await admin.visitAdminPage('admin.php', 'page=wptelegram_comments');
	});

	test.afterAll(async ({ requestUtils }) => {
		await requestUtils.deactivatePlugin('wp-telegram-comments');
		await rest.deleteOption('wptelegram_comments');
	});

	test('Should have instructions', async ({ page }) => {
		await expect(page.locator('body')).toContainText('INSTRUCTIONS!');
	});

	test('Should not allow submission without code', async ({ page }) => {
		const code = page.getByLabel('Code');

		const validationMessage = await code.evaluate(
			(el: HTMLTextAreaElement) => el.validationMessage,
		);

		expect(validationMessage).toBe('Please fill out this field.');

		// Should not show validation message before submission.
		await expect(page.locator('body')).not.toContainText('Code required');

		await actions.saveChangesButton.click();

		// Press tab key to blur the code input to dismiss form validation tooltip.
		await page.keyboard.press('Tab');

		await expect(page.locator('body')).toContainText('Code required');
	});

	test('Should not allow submission with invalid code', async ({ page }) => {
		await page.getByLabel('Code').fill('invalid-code');

		// Press tab key to blur the code input to trigger validation.
		await page.keyboard.press('Tab');

		await expect(page.locator('body')).toContainText('Invalid Code');
	});

	test('Should save the changes', async ({ page }) => {
		await page.getByLabel('Code').fill('<script async></script>');

		await actions.saveChangesAndWait({
			endpoint: '/wptelegram-comments/v1/settings',
			assertSaved: true,
		});

		// Reload the page and wait
		await page.reload();

		const code = page.getByLabel('Code');

		await code.waitFor();

		await expect(code).toHaveValue('<script async></script>');
	});

	test('Should clean up the inputs', async ({ page }) => {
		await page
			.getByLabel('Code')
			.fill('<script async unknown-attr="some-value"></script>');

		await page.getByLabel('Exclude').fill('1, 2, 3,invalid,');

		await actions.saveChangesAndWait({
			endpoint: '/wptelegram-comments/v1/settings',
		});

		await expect(page.getByLabel('Code')).toHaveValue(
			'<script async></script>',
		);

		await expect(page.getByLabel('Exclude')).toHaveValue('1,2,3');
	});
});
