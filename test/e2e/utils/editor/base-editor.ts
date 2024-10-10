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
}
