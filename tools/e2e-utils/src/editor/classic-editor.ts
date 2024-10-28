import { BaseEditor } from './base-editor.js';

export class ClassicEditor extends BaseEditor {
	async setUp() {
		await this.requestUtils.activatePlugin('classic-editor');
	}

	async tearDown() {
		await this.requestUtils.deactivatePlugin('classic-editor');
	}

	async publishPost(): Promise<number | null> {
		const publishButton = this.page.locator(
			'input[type="submit"][name="publish"][value="Publish"]',
		);

		const publishNotice = this.page
			.getByRole('paragraph')
			.filter({ hasText: 'Post published.' });

		await Promise.all([publishButton.click(), publishNotice.waitFor()]);

		const postId = this.page.url().match(/post=(\d+)/)?.[1];

		return postId ? Number(postId) : null;
	}

	async enableCodeEditor() {
		await this.page.getByRole('button', { name: 'Text', exact: true }).click();
	}

	async insertShortCode(shortCode: string) {
		await this.enableCodeEditor();

		const content = this.page.locator('textarea[name="content"]');

		await content.fill(shortCode);
	}

	async clearContent() {}
}
