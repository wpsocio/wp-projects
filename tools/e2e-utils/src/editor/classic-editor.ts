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
		const button = this.page.getByRole('button', { name: 'Text', exact: true });

		// The button was changed to "Code" in WordPress 6.7.2
		if (await button.count()) {
			await button.click();
		} else {
			await this.page
				.getByRole('button', { name: 'Code', exact: true })
				.first()
				.click();
		}
	}

	async insertShortCode(shortCode: string) {
		await this.enableCodeEditor();

		const content = this.page.locator('textarea[name="content"]');

		await content.fill(shortCode);
	}

	async clearContent() {}
}
