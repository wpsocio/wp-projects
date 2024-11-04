import type { Locator, Page } from '@playwright/test';
import { expect, test } from '@wordpress/e2e-test-utils-playwright';
import { Actions, BlockEditor, ClassicEditor, REST } from '@wpsocio/e2e-utils';
import { TEST_BOT_TOKEN, TEST_BOT_USERNAME } from '../../utils/constants.js';

async function setupPostToTelegramSection(page: Page) {
	await page.getByRole('tab', { name: 'Basics' }).click();

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
	await tabPanel.getByRole('switch', { name: 'Active' }).check({ force: true });

	await tabPanel.getByRole('button', { name: 'Add channel' }).click();

	await tabPanel.getByPlaceholder('@username').last().fill('@WPTelegram');

	return tabPanel;
}

test.describe('Settings > P2TG', () => {
	let actions: Actions;
	let rest: REST;
	let tabPanel: Locator;

	test.beforeAll(async ({ requestUtils }) => {
		rest = new REST(requestUtils);
		await requestUtils.activatePlugin('wp-telegram');
	});

	test.beforeEach(async ({ admin, pageUtils, page }) => {
		actions = new Actions(pageUtils);

		await rest.deleteOption('wptelegram');

		await admin.visitAdminPage('admin.php', 'page=wptelegram');

		tabPanel = await setupPostToTelegramSection(page);
	});

	test.afterAll(async ({ requestUtils }) => {
		await requestUtils.deactivatePlugin('wp-telegram');
		await rest.deleteOption('wptelegram');
	});

	test('Should disable the irrelevant fields', async () => {
		// Fields that depend on the `{post_excerpt}` template tag
		const templateField = tabPanel.getByLabel('Message Template');

		const excerptFields = [
			'Excerpt Source',
			'Excerpt Length',
			'Excerpt Newlines',
		];

		for (const field of excerptFields) {
			await expect(tabPanel.getByLabel(field)).not.toBeDisabled();
		}

		// Remove '{post_excerpt}' from the template
		await templateField.fill('Some text');

		for (const field of excerptFields) {
			await expect(tabPanel.getByLabel(field)).toBeDisabled();
		}

		// Fields that depend on the featured image
		const featuredImageField = tabPanel.getByLabel('Featured Image');

		const imagePosition = tabPanel
			.locator('input[type="radio"][name="p2tg.image_position"]')
			.first();

		const singleMessage = tabPanel.getByRole('switch', {
			name: 'Single Message',
		});

		await expect(imagePosition).not.toBeDisabled();
		await expect(singleMessage).not.toBeDisabled();

		// Now disable the featured image
		await featuredImageField.uncheck({ force: true });

		await expect(imagePosition).toBeDisabled();
		await expect(singleMessage).toBeDisabled();

		// Fields that depend on "Disable link preview"
		const disableLinkPreview = tabPanel.getByRole('switch', {
			name: 'Disable link preview',
		});
		const linkPreviewUrl = tabPanel.getByLabel('Link Preview URL');
		const showPreviewAboveText = tabPanel.getByRole('switch', {
			name: 'Show preview above text',
		});

		await expect(linkPreviewUrl).not.toBeDisabled();
		await expect(showPreviewAboveText).not.toBeDisabled();

		// Now disable the link preview
		await disableLinkPreview.check({ force: true });

		await expect(linkPreviewUrl).toBeDisabled();
		await expect(showPreviewAboveText).toBeDisabled();

		// Fields that depend on the "Add Inline URL Button" setting
		const inlineButtonSwitch = tabPanel.getByRole('switch', {
			name: 'Add Inline URL Button',
		});
		const inlineButtonText = tabPanel.getByLabel('Inline Button Text');
		const inlineButtonUrl = tabPanel.getByLabel('Inline Button URL');

		await expect(inlineButtonSwitch).not.toBeChecked(); // By default, it is OFF

		await expect(inlineButtonText).toBeDisabled();
		await expect(inlineButtonUrl).toBeDisabled();

		// Enable the inline button
		await inlineButtonSwitch.check({ force: true });

		await expect(inlineButtonText).not.toBeDisabled();
		await expect(inlineButtonUrl).not.toBeDisabled();
	});

	test('Should show warnings for Single Message', async () => {
		const singleMessage = tabPanel.getByRole('switch', {
			name: 'Single Message',
		});

		const imagePositionAfter = tabPanel.getByRole('radio', {
			name: 'After the Text',
		});

		const htmlStyle = tabPanel.getByRole('radio', {
			name: 'HTML style',
		});

		const disableLinkPreview = tabPanel.getByRole('switch', {
			name: 'Disable link preview',
		});

		const formattingWarning = 'Formatting should not be None.';
		const linkPreviewWarning = 'Disable link preview should not be enabled.';

		await expect(tabPanel).not.toContainText(formattingWarning);
		await expect(tabPanel).not.toContainText(linkPreviewWarning);

		await imagePositionAfter.check({ force: true });
		await expect(tabPanel).toContainText(formattingWarning);
		await expect(tabPanel).not.toContainText(linkPreviewWarning);

		//Now we should have both the warnings
		await disableLinkPreview.check({ force: true });
		await expect(tabPanel).toContainText(linkPreviewWarning);
		await expect(tabPanel).toContainText(formattingWarning);

		// Disabling Single Message should remove the warnings
		await singleMessage.uncheck({ force: true });
		await expect(tabPanel).not.toContainText(formattingWarning);
		await expect(tabPanel).not.toContainText(linkPreviewWarning);

		await singleMessage.check({ force: true });

		// Enabling HTML style should remove the formatting warning
		await htmlStyle.check({ force: true });
		await expect(tabPanel).not.toContainText(formattingWarning);
		await expect(tabPanel).toContainText(linkPreviewWarning);
	});

	test('Should clean up message template after saving changes', async ({
		page,
	}) => {
		let templateField = tabPanel.getByLabel('Message Template');

		templateField.fill(
			// trailing whitespaces, <div> and <script> tags should be removed
			'\n\n <b>{post_title}</b>\n\n<div>{post_excerpt}</div>\n\n<a href="{full_url}">View post</a>\n\n<script async src="https://example.com/some.js"></script>\n \n',
		);

		await actions.saveChangesAndWait({
			endpoint: '/wptelegram/v1/settings',
			assertSaved: true,
		});

		const expectedValue =
			'<b>{post_title}</b>\n\n{post_excerpt}\n\n<a href="{full_url}">View post</a>';

		// Should reflect immediately and after reload as well
		await expect(templateField).toHaveValue(expectedValue);

		await page.reload();

		tabPanel = await setupPostToTelegramSection(page);

		templateField = tabPanel.getByLabel('Message Template');

		await templateField.waitFor();

		await expect(templateField).toHaveValue(expectedValue);
	});

	test('Should show/hide the post edit page UI', async ({
		admin,
		pageUtils,
		requestUtils,
		editor,
		page,
	}) => {
		const classicEditor = new ClassicEditor({ admin, pageUtils, requestUtils });
		const blockEditor = new BlockEditor({
			admin,
			pageUtils,
			requestUtils,
			editor,
		});

		const editors = [
			{ type: 'classic', editorInstance: classicEditor },
			{ type: 'block', editorInstance: blockEditor },
		];

		async function assertTheUiToBe(status: 'visible' | 'hidden') {
			for (const { type, editorInstance } of editors) {
				await test.step(`Set up the ${type} editor`, async () => {
					await editorInstance.setUp();
				});

				await test.step(`Should be ${status} in ${type} editor`, async () => {
					await editorInstance.createNewPost();

					const sendToTelegram = page.getByRole('checkbox', {
						name: 'Send to Telegram',
					});

					if (status === 'visible') {
						await expect(sendToTelegram).toBeVisible();
					} else {
						await expect(sendToTelegram).toBeHidden();
					}
				});

				await test.step(`Clean up the ${type} editor`, async () => {
					await editorInstance.tearDown();
				});
			}
		}

		// By default, the UI should be hidden when settings are not saved
		await assertTheUiToBe('hidden');

		await admin.visitAdminPage('admin.php', 'page=wptelegram');

		tabPanel = await setupPostToTelegramSection(page);

		await actions.saveChangesAndWait({
			endpoint: '/wptelegram/v1/settings',
		});

		// Now the UI should be visible
		await assertTheUiToBe('visible');

		await admin.visitAdminPage('admin.php', 'page=wptelegram');

		// Now lets us turn OFF post edit switch
		tabPanel = await setupPostToTelegramSection(page);

		await tabPanel
			.getByRole('switch', { name: 'Post edit switch' })
			.uncheck({ force: true });

		await actions.saveChangesAndWait({
			endpoint: '/wptelegram/v1/settings',
		});

		// Now the UI should be hidden
		await assertTheUiToBe('hidden');
	});

	test('Should verify that the rules behave as expected', async ({
		admin,
		pageUtils,
		requestUtils,
		editor,
		page,
	}) => {
		const blockEditor = new BlockEditor({
			admin,
			pageUtils,
			requestUtils,
			editor,
		});

		await blockEditor.addCategoriesAndTags(true);

		await admin.visitAdminPage('admin.php', 'page=wptelegram');

		tabPanel = await setupPostToTelegramSection(page);

		const endpoint = '/wptelegram/v1/p2tg-rules';

		await Promise.all([
			page.getByRole('button', { name: 'Add rule' }).click(),
			actions.waitForApiResponse(endpoint),
		]);

		const combobox = page.getByRole('combobox', { name: 'Rule values' });

		await Promise.all([
			combobox.fill('ABC'),
			actions.waitForApiResponse(endpoint, { search: 'ABC' }),
		]);

		const listbox = page.getByRole('listbox');

		await listbox.waitFor();

		const options = listbox.getByRole('option');

		// Assert that there are only two options
		await expect(options).toHaveCount(2);
		await expect(listbox).toContainText('ABC Cat → ABC Child cat');

		// Let us select an option
		await options.filter({ hasText: 'ABC Cat → ABC Child cat' }).click();

		await Promise.all([
			combobox.fill('ABC'),
			actions.waitForApiResponse(endpoint, { search: 'ABC' }),
		]);

		await options.waitFor();

		// Now there should be only one option
		await expect(options).toHaveCount(1);
		await expect(options.first()).not.toContainText('ABC Cat → ABC Child cat');
		await expect(options.first()).toContainText('ABC Cat');
		// Let us select another option
		await options.first().click();

		await actions.saveChangesAndWait({
			endpoint: '/wptelegram/v1/settings',
		});

		await page.reload();

		const valueContainer = page.locator('.data__values-container');

		await valueContainer.waitFor();
		// We should two options selected
		await expect(valueContainer.locator('.data__multi-value')).toHaveCount(2);

		// Let us add another rule to the group
		await page.getByRole('button', { name: 'Add another rule' }).click();
		await page.getByRole('combobox', { name: 'Rule values' }).last().click();
		// The options should be readily available without making an API call
		// The listbox should not show "Loading..."

		await expect(page.getByRole('listbox')).not.toContainText('Loading');

		expect(
			await page.getByRole('listbox').getByRole('option').count(),
		).toBeGreaterThan(0);

		// Now let us change the "Rule type"
		await actions.selectOption(
			page.getByRole('combobox', { name: 'Rule type' }).first(),
			'Post Tag',
		);

		// The selected values should be cleared
		await expect(
			valueContainer.first().locator('.data__multi-value'),
		).toHaveCount(0);

		// Let us remove the first rule, which is now "Post Tag"
		await page
			.getByRole('button', { name: 'Remove this rule' })
			.first()
			.click();

		const ruleType = page.getByRole('combobox', { name: 'Rule type' });

		await expect(ruleType).toHaveCount(1);

		await expect(ruleType).toHaveText('Post Category');

		await page
			.getByRole('combobox', { name: 'Rule values' })
			.fill('non-existent');

		await expect(page.getByRole('listbox')).toContainText(
			'No options available',
		);

		// Now let us save the changes
		// The rule should be removed because nothing is selected
		await actions.saveChangesAndWait({
			endpoint: '/wptelegram/v1/settings',
		});

		await expect(valueContainer).toHaveCount(0);
	});
});
