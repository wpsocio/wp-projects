import { useDispatch, useSelect } from '@wordpress/data';
import { store as editorStore } from '@wordpress/editor';
import { useCallback } from '@wordpress/element';

import { __KEY__ } from './constants';
import type { DataShape, DataState } from './types';

type UpdateField = <K extends keyof DataShape>(
	field: K,
) => (value: DataShape[K]) => void;

let DEFAULT_DATA: DataShape = {
	channels: [],
	delay: '0',
	disable_notification: false,
	message_template: '',
	override_switch: false,
	send2tg: true,
	send_featured_image: true,
	files: {},
	...window.wptelegram?.savedSettings,
};

export const useUpdateField = (): UpdateField => {
	const { editPost } = useDispatch('core/editor');
	const { data } = useDataState();

	return useCallback<UpdateField>(
		(field) => {
			return (value) => {
				const newData = { ...data, [field]: value };

				editPost({ [__KEY__]: newData }, { undoIgnore: true });

				// Update default data to ensure re-renders don't reset the data
				DEFAULT_DATA = newData;
			};
		},
		[data, editPost],
	);
};

export const useDataState = (): DataState => {
	return useSelect((select) => {
		const {
			getEditedPostAttribute,
			// required flags
			isSavingPost,
			isPublishingPost,
			isEditedPostDirty,
		} = select(editorStore);

		// biome-ignore lint/suspicious/noExplicitAny: Any is fine here
		const savedData = getEditedPostAttribute(__KEY__ as any) as DataShape;

		return {
			data: savedData || DEFAULT_DATA,
			isDirty: isEditedPostDirty(),
			isSaving: isSavingPost() || isPublishingPost(),
			savedData,
		};
	}, []);
};
