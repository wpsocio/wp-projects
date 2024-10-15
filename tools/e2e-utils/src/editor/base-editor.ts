import type { Page } from '@playwright/test';
import type {
	Admin,
	PageUtils,
	RequestUtils,
} from '@wordpress/e2e-test-utils-playwright';

export interface BaseEditorOptions {
	pageUtils: PageUtils;
	requestUtils: RequestUtils;
	admin: Admin;
}

export abstract class BaseEditor {
	protected pageUtils: PageUtils;
	protected requestUtils: RequestUtils;
	protected admin: Admin;
	protected page: Page;

	constructor({ pageUtils, requestUtils, admin }: BaseEditorOptions) {
		this.pageUtils = pageUtils;
		this.requestUtils = requestUtils;
		this.admin = admin;
		this.page = pageUtils.page;
	}

	async setUp() {}

	async tearDown() {}

	async setTitle(title: string): Promise<void> {
		await this.page.getByRole('textbox', { name: 'Add title' }).fill(title);
	}

	async createNewPost() {
		await this.admin.visitAdminPage('post-new.php');
	}

	abstract publishPost(): Promise<number | null>;

	abstract insertShortCode(shortCode: string): Promise<void>;

	abstract clearContent(): Promise<void>;

	async addCategoriesAndTags(deleteExisting = false) {
		const taxonomyTerms = {
			category: [
				{ name: 'ABC Cat' },
				{ name: 'DEF Cat' },
				{ name: 'GHI Cat' },
				{ name: 'XYZ Cat' },
				{ name: 'جبا Cat' },
				{ name: 'قط means Cat' },
				{ name: 'ABC Child cat', parent: 'ABC Cat' },
				{ name: 'DEF Child cat', parent: 'DEF Cat' },
				{ name: 'XYZ Child Cat', parent: 'XYZ Cat' },
			],
			post_tag: [
				{ name: 'ABC Tag' },
				{ name: 'DEF Tag' },
				{ name: 'GHI Tag' },
				{ name: 'XYZ Tag' },
				{ name: 'جبا Tag' },
				{ name: 'جبل is mountain', parent: '' },
			],
		};

		for (const [taxonomy, terms] of Object.entries(taxonomyTerms)) {
			await this.admin.visitAdminPage('edit-tags.php', `taxonomy=${taxonomy}`);

			if (deleteExisting) {
				while (
					(await this.page.locator('table.wp-list-table tbody tr').count()) > 1
				) {
					await this.page
						.getByRole('checkbox', { name: 'Select All' })
						.first()
						.check();

					const bulkActions = this.page
						.locator('div.actions.bulkactions')
						.first();

					await bulkActions
						.getByLabel('Select bulk action')
						.selectOption('Delete');

					await Promise.all([
						bulkActions.locator('input[type="submit"][value="Apply"]').click(),
						this.page.waitForResponse((resp) => {
							return (
								resp.url().includes('wp-admin/edit-tags.php') &&
								resp.request().method() === 'POST' &&
								(resp.request().postData() || '').includes('action=delete')
							);
						}),
					]);
				}
			}

			for (const { name, parent } of terms) {
				const form = this.page.locator('form#addtag');

				await form.getByLabel('Name').fill(name);

				if (parent) {
					await form.getByLabel('Parent Category').selectOption(parent);
				}

				await Promise.all([
					form.locator('input[type="submit"]').click(),
					this.page.waitForResponse((resp) => {
						return (
							resp.url().includes('wp-admin/admin-ajax.php') &&
							(resp.request().postData() || '').includes('action=add-tag')
						);
					}),
				]);
			}
		}
	}
}
