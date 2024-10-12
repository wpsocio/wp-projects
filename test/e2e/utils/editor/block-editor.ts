import type { Editor as TEditor } from '@wordpress/e2e-test-utils-playwright';
import { BaseEditor, type BaseEditorOptions } from './base-editor.js';

export interface BlockEditorOptions extends BaseEditorOptions {
	editor: TEditor;
}

export class BlockEditor extends BaseEditor {
	editor: TEditor;

	constructor({ editor, ...baseOptions }: BlockEditorOptions) {
		super(baseOptions);

		this.editor = editor;
	}

	async createNewPost() {
		await this.admin.createNewPost();
	}

	async publishPost() {
		return await this.editor.publishPost();
	}

	async insertShortCode(shortCode: string) {
		await this.editor.insertBlock({ name: 'core/shortcode' });
		await this.page.keyboard.type(shortCode);
	}

	async clearContent() {}
}
