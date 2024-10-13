import { expect, test } from '@wordpress/e2e-test-utils-playwright';
import { Actions, REST } from '@wpsocio/e2e-utils';
import { DEFAULT_THEME } from '../../config/constants.js';

test.describe('Public UI', () => {
	let actions: Actions;
	let rest: REST;

	test.beforeAll(async ({ requestUtils }) => {
		rest = new REST(requestUtils);
		await requestUtils.activatePlugin('wp-telegram-comments');
	});

	test.beforeEach(async ({ pageUtils }) => {
		actions = new Actions(pageUtils);
	});

	test.afterAll(async ({ requestUtils }) => {
		await requestUtils.deactivatePlugin('wp-telegram-comments');
		await rest.deleteOption('wptelegram_comments');
	});

	test('Should render the comments widget ', async ({
		requestUtils,
		page,
		editor,
		admin,
	}) => {
		const { postId, activeTheme } = await test.step('Prepare', async () => {
			await admin.createNewPost();

			await editor.canvas
				.getByRole('textbox', { name: 'Add title' })
				.fill('A published post');

			return {
				postId: await editor.publishPost(),
				activeTheme: await rest.getActiveTheme(),
			};
		});

		const themeTestCases = [
			{
				type: 'legacy',
				theme: 'twentytwentyone',
			},
			{
				type: 'block-based',
				theme: 'twentytwentyfour',
			},
		];

		for (const { type, theme } of themeTestCases) {
			await test.step(`Render in ${type} themes`, async () => {
				await test.step('Reset settings', async () => {
					await rest.deleteOption('wptelegram_comments');

					await admin.visitAdminPage('admin.php', 'page=wptelegram_comments');

					await page.getByLabel('Code').selectText();

					await page.keyboard.type(
						'<script async src="https://comments.app/js/widget.js" data-comments-app-website="abcdefghi" id="e2e-test-comments"></script>',
					);

					await actions.saveChangesAndWait({
						apiPath: '/wptelegram-comments/v1/settings',
					});
				});

				await requestUtils.activateTheme(theme);

				await page.goto(`/?p=${postId}`);

				const script = page.locator('script[id="e2e-test-comments"]');

				await expect(script).toHaveCount(1);

				const value = await script.evaluate((el) =>
					el.getAttribute('data-comments-app-website'),
				);

				expect(value).toBe('abcdefghi');

				// Now let us exclude the post
				await admin.visitAdminPage('admin.php', 'page=wptelegram_comments');

				await page.getByLabel('Exclude').selectText();

				await page.keyboard.type(`${postId}`);

				await actions.saveChangesAndWait({
					apiPath: '/wptelegram-comments/v1/settings',
				});

				await page.goto(`/?p=${postId}`);

				await expect(
					page.locator('script[id="e2e-test-comments"]'),
				).toHaveCount(0);

				// Now let us disable comments on posts
				await admin.visitAdminPage('admin.php', 'page=wptelegram_comments');

				await page
					.getByRole('checkbox', { name: 'Post (post)', exact: true })
					.uncheck({ force: true });

				await page.getByLabel('Exclude').clear();

				await actions.saveChangesAndWait({
					apiPath: '/wptelegram-comments/v1/settings',
				});

				await page.goto(`/?p=${postId}`);

				await expect(
					page.locator('script[id="e2e-test-comments"]'),
				).toHaveCount(0);
			});
		}

		await test.step('Restore the active theme', async () => {
			await requestUtils.activateTheme(
				activeTheme?.stylesheet || DEFAULT_THEME,
			);
		});
	});
});
