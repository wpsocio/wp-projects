import { expect, test } from '@wordpress/e2e-test-utils-playwright';
import { Actions } from '../../utils/actions.js';
import { BlockEditor } from '../../utils/editor/block-editor.js';
import { ClassicEditor } from '../../utils/editor/classic-editor.js';
import { REST } from '../../utils/rest.js';

test.describe('Public UI', () => {
	let actions: Actions;
	let rest: REST;
	let classicEditor: ClassicEditor;
	let blockEditor: BlockEditor;

	const botToken = '123456789:y7SdjUVdeSA8HRF3WmOqHAA-cOIiz9u04dC';

	test.beforeAll(async ({ requestUtils }) => {
		rest = new REST(requestUtils);
		await requestUtils.activatePlugin('wp-telegram-login');
	});

	test.beforeEach(async ({ admin, page, pageUtils, requestUtils, editor }) => {
		actions = new Actions(pageUtils);
		classicEditor = new ClassicEditor({ admin, pageUtils, requestUtils });
		blockEditor = new BlockEditor({ admin, pageUtils, requestUtils, editor });

		await rest.deleteOption('wptelegram_login');

		await admin.visitAdminPage('admin.php', 'page=wptelegram_login');

		// Save the bot token and username
		const botTokenField = page.getByLabel('Bot Token');
		await botTokenField.fill(botToken);

		const botUsernameField = page.getByLabel('Bot Username');
		await botUsernameField.dblclick();
		await botUsernameField.fill('E2ETestBot');

		await actions.saveChangesAndWait({
			apiPath: '/wptelegram-login/v1/settings',
		});
	});

	test.afterAll(async ({ requestUtils }) => {
		await requestUtils.deactivatePlugin('wp-telegram-login');
		await rest.deleteOption('wptelegram_login');
	});

	test('Should render the login button via shortcode', async ({ page }) => {
		const editors = [
			() => ({ type: 'classic', editorInstance: classicEditor }),
			() => ({ type: 'block', editorInstance: blockEditor }),
		];

		for (const getEditor of editors) {
			const { type, editorInstance } = getEditor();

			await test.step(`Set up the ${type} editor`, async () => {
				await editorInstance.setUp();
			});

			await test.step(`Render in ${type} editor`, async () => {
				await editorInstance.createNewPost();
				await editorInstance.setTitle('A published with Telegram login button');
				await editorInstance.insertShortCode(
					// This verifies that the attribute overrides the settings value.
					'[wptelegram-login show_if_user_is="any"]',
				);

				const postId = await editorInstance.publishPost();
				await page.goto(`/?p=${postId}`);

				await expect(
					page.locator('script[data-telegram-login="E2ETestBot"]'),
				).toHaveCount(1);
			});

			await test.step(`Clean up the ${type} editor`, async () => {
				await editorInstance.tearDown();
			});
		}
	});

	test('Should render the login button via the block in block editor', async ({
		page,
		admin,
		editor,
	}) => {
		await admin.createNewPost();

		await page
			.getByRole('textbox', { name: 'Add title' })
			.fill('Test post for Telegram Login block');

		await editor.insertBlock({ name: 'wptelegram/login' });

		await page.getByLabel('Show User Photo').uncheck();
		await page.getByLabel('Show if user is').selectOption('Any');

		const postId = await editor.publishPost();

		await page.goto(`/?p=${postId}`);

		const script = page.locator('script[data-telegram-login="E2ETestBot"]');

		await expect(script).toHaveCount(1);

		expect(await script.getAttribute('data-userpic')).toBe('false');
	});

	test('Should show or hide the Telegram login on default login page.', async ({
		page,
		admin,
	}) => {
		// Select "Any" option for "Show if user is" setting
		await actions.selectOption(page.getByLabel('Show if user is'), 'Any');

		await actions.saveChangesAndWait({
			apiPath: '/wptelegram-login/v1/settings',
		});

		await page.goto('/wp-login.php');

		await expect(
			page.locator('script[data-telegram-login="E2ETestBot"]'),
		).toHaveCount(1);

		await admin.visitAdminPage('admin.php', 'page=wptelegram_login');

		await page.getByLabel('Hide on default login').check({ force: true });

		await actions.saveChangesAndWait({
			apiPath: '/wptelegram-login/v1/settings',
		});

		await page.goto('/wp-login.php');

		await expect(
			page.locator('script[data-telegram-login="E2ETestBot"]'),
		).toHaveCount(0);
	});
});
