import { expect, test } from '@wordpress/e2e-test-utils-playwright';
import { Actions } from '../../utils/actions.js';
import { REST } from '../../utils/rest.js';

test.describe('Public UI', () => {
	let actions: Actions;
	let rest: REST;

	test.beforeAll(async ({ requestUtils }) => {
		await requestUtils.activatePlugin('wp-telegram-comments');
		rest = new REST(requestUtils);
	});

	test.beforeEach(async ({ admin, page }) => {
		actions = new Actions(page);
		await rest.deleteOption('wptelegram_comments');

		await admin.visitAdminPage('admin.php', 'page=wptelegram_comments');

		await page.getByLabel('Code').selectText();

		await page.keyboard.type(
			'<script async src="https://comments.app/js/widget.js" data-comments-app-website="abcdefghi" id="e2e-test-comments"></script>',
		);

		await actions.saveChangesAndWait({
			apiPath: 'wp-json/wptelegram-comments/v1/settings',
		});
	});

	test.afterAll(async ({ requestUtils }) => {
		await requestUtils.deactivatePlugin('wp-telegram-comments');
		await rest.deleteOption('wptelegram_comments');
	});

	const themeTestCases = [
		{
			type: 'block-based',
			theme: 'twentytwentyfour',
		},
		{
			type: 'legacy',
			theme: 'twentytwentyone',
		},
	];

	for (const { type, theme } of themeTestCases) {
		test(`Should render the widget in ${type} themes`, async ({
			requestUtils,
			page,
			editor,
			admin,
		}) => {
			await requestUtils.activateTheme(theme);

			await admin.createNewPost();

			await editor.canvas
				.getByRole('textbox', { name: 'Add title' })
				.fill('A published post');

			const postId = await editor.publishPost();

			await page.goto(`/?p=${postId}`);

			await expect(page.locator('script[id="e2e-test-comments"]')).toHaveCount(
				1,
			);

			// Now let us exclude the post
			await admin.visitAdminPage('admin.php', 'page=wptelegram_comments');

			await page.getByLabel('Exclude').selectText();

			await page.keyboard.type(`${postId}`);

			await actions.saveChangesAndWait({
				apiPath: 'wp-json/wptelegram-comments/v1/settings',
			});

			await page.goto(`/?p=${postId}`);

			await expect(page.locator('script[id="e2e-test-comments"]')).toHaveCount(
				0,
			);

			// Now let us disable comments on posts
			await admin.visitAdminPage('admin.php', 'page=wptelegram_comments');

			await page
				.getByRole('checkbox', { name: 'Post (post)', exact: true })
				.uncheck({ force: true });

			await page.getByLabel('Exclude').clear();

			await actions.saveChangesAndWait({
				apiPath: 'wp-json/wptelegram-comments/v1/settings',
			});

			await page.goto(`/?p=${postId}`);

			await expect(page.locator('script[id="e2e-test-comments"]')).toHaveCount(
				0,
			);
		});
	}
});
