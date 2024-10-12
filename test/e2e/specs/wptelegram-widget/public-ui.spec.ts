import { expect, test } from '@wordpress/e2e-test-utils-playwright';
import { DEFAULT_THEME } from '../../config/constants.js';
import { Actions } from '../../utils/actions.js';
import { BlockEditor } from '../../utils/editor/block-editor.js';
import { ClassicEditor } from '../../utils/editor/classic-editor.js';
import { REST } from '../../utils/rest.js';

test.describe('Public UI', () => {
	let actions: Actions;
	let rest: REST;
	let classicEditor: ClassicEditor;
	let blockEditor: BlockEditor;

	test.beforeAll(async ({ requestUtils }) => {
		rest = new REST(requestUtils);
		await requestUtils.activatePlugin('wp-telegram-widget');
	});

	test.beforeEach(async ({ admin, page, pageUtils, requestUtils, editor }) => {
		actions = new Actions(pageUtils);
		classicEditor = new ClassicEditor({ admin, pageUtils, requestUtils });
		blockEditor = new BlockEditor({ admin, pageUtils, requestUtils, editor });
		await rest.deleteOption('wptelegram_widget');

		await admin.visitAdminPage('admin.php', 'page=wptelegram_widget');

		const tabFields: Array<
			[tabNam: string, Array<[label: string, value: string]>]
		> = [
			['Ajax widget', [['Username', 'WPTelegram']]],
			[
				'Join Link',
				[
					['Channel Link', 'https://t.me/WPTelegram'],
					['Button text', 'Join our channel'],
				],
			],
		];

		for (const [tabName, fields] of tabFields) {
			const button = page.getByRole('tab', { name: tabName });

			await button.click();
			const buttonId = await button.getAttribute('id');

			// Get the tab panel that the button controls
			const tabPanel = page.locator(
				`div[role="tabpanel"][aria-labelledby="${buttonId}"]`,
			);

			for (const [label, value] of fields) {
				await tabPanel.getByLabel(label).fill(value);
			}
		}

		await actions.saveChangesAndWait({
			apiPath: '/wptelegram-widget/v1/settings',
		});
	});

	test.afterAll(async ({ requestUtils }) => {
		await requestUtils.deactivatePlugin('wp-telegram-widget');
		await rest.deleteOption('wptelegram_widget');
	});

	test('Should render the join link automatically', async ({
		requestUtils,
		page,
		editor,
		admin,
	}) => {
		const { postId, activeTheme } = await test.step('Prepare', async () => {
			await admin.createNewPost();

			await page
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
					await admin.visitAdminPage('admin.php', 'page=wptelegram_widget');

					await page
						.getByRole('checkbox', { name: 'Post (post)', exact: true })
						.check({ force: true });

					await actions.saveChangesAndWait({
						apiPath: '/wptelegram-widget/v1/settings',
					});
				});

				await requestUtils.activateTheme(theme);

				await page.goto(`/?p=${postId}`);

				const link = page.getByRole('link', { name: 'Join our channel' });

				await expect(link).toBeVisible();

				const href = await link.getAttribute('href');

				expect(href).toBe('https://t.me/WPTelegram');

				// Now let us disable widget on posts
				await admin.visitAdminPage('admin.php', 'page=wptelegram_widget');

				await page
					.getByRole('checkbox', { name: 'Post (post)', exact: true })
					.uncheck({ force: true });

				await actions.saveChangesAndWait({
					apiPath: '/wptelegram-widget/v1/settings',
				});

				await page.goto(`/?p=${postId}`);

				await expect(link).toHaveCount(0);
			});
		}
		await test.step('Restore the active theme', async () => {
			await requestUtils.activateTheme(
				activeTheme?.stylesheet || DEFAULT_THEME,
			);
		});
	});

	test('Should render the join link via shortcode', async ({ page }) => {
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
					'[wptelegram-join-channel link="https://t.me/WPTelegramChat" text="Join our public chat on Telegram"]',
				);

				const postId = await editorInstance.publishPost();
				await page.goto(`/?p=${postId}`);

				const linksToAssert = [
					['Join our public chat on Telegram', 'https://t.me/WPTelegramChat'],
					// The default link should also be rendered
					['Join our channel', 'https://t.me/WPTelegram'],
				];

				for (const [text, href] of linksToAssert) {
					const link = page.getByRole('link', { name: text });

					await expect(link).toBeVisible();

					const linkHref = await link.getAttribute('href');

					expect(linkHref).toBe(href);
				}
			});

			await test.step(`Clean up the ${type} editor`, async () => {
				await editorInstance.tearDown();
			});
		}
	});

	test('Should render the ajax widget via shortcode', async ({ page }) => {
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
					'[wptelegram-ajax-widget username="SomeChannelUsername" width="110%" height="555px"]',
				);

				const postId = await editorInstance.publishPost();
				await page.goto(`/?p=${postId}`);

				const iframe = page.locator('.wptelegram-widget-ajax-widget iframe');

				await expect(iframe).toHaveCount(1);

				const src = await iframe.getAttribute('src');

				expect(src).toContain('SomeChannelUsername');

				expect(await iframe.getAttribute('width')).toBe('110%');
				expect(await iframe.getAttribute('height')).toBe('555px');
			});

			await test.step(`Clean up the ${type} editor`, async () => {
				await editorInstance.tearDown();
			});
		}
	});

	test('Should render the ajax widget via the block in block editor', async ({
		page,
		admin,
		editor,
	}) => {
		await admin.createNewPost();

		await page
			.getByRole('textbox', { name: 'Add title' })
			.fill('Test post for Telegram Login block');

		await editor.insertBlock({ name: 'wptelegram/widget-ajax-channel-feed' });

		const panel = page
			.getByRole('tabpanel')
			.filter({ hasText: 'Telegram Channel Ajax Feed' });

		await panel.getByLabel('Username').fill('SomeUsernameHere');
		await panel.getByLabel('Widget Width').fill('111%');
		await panel.getByLabel('Widget Height').fill('444px');

		const postId = await editor.publishPost();

		await page.goto(`/?p=${postId}`);

		const iframe = page.locator('.wptelegram-widget-ajax-widget iframe');

		await expect(iframe).toHaveCount(1);

		const src = await iframe.getAttribute('src');

		expect(src).toContain('SomeUsernameHere');

		expect(await iframe.getAttribute('width')).toBe('111%');
		expect(await iframe.getAttribute('height')).toBe('444px');
	});
});
