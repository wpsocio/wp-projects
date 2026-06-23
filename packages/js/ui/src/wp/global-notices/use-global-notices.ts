import { useDispatch, useSelect } from '@wordpress/data';
import { store as noticesStore } from '@wordpress/notices';
import type { WPNotice } from '@wordpress/notices/build-types/store/selectors.js';
import { useCallback, useMemo } from 'react';

type NoticesStore = ReturnType<(typeof noticesStore)['instantiate']>;

export type TGlobalNotices = ReturnType<NoticesStore['getActions']> &
	ReturnType<NoticesStore['getSelectors']>;

/**
 * The global notices hook.
 *
 * @return The global notices selectors and actions.
 */
export function useGlobalNotices() {
	const actionCreators = useDispatch(noticesStore);
	const notices = useSelect((select) => select(noticesStore).getNotices(), []);

	const createNotice = useCallback<typeof actionCreators.createNotice>(
		(status, content, options) => {
			return actionCreators.createNotice(status, content, {
				type: 'snackbar',
				id: status + content,
				...options,
			});
		},
		[actionCreators.createNotice],
	);

	return useMemo<TGlobalNotices>(() => {
		return {
			...actionCreators,
			createNotice,
			createErrorNotice(content, options) {
				return createNotice('error', content, options);
			},
			createInfoNotice(content, options) {
				return createNotice('info', content, options);
			},
			createSuccessNotice(content, options) {
				return createNotice('success', content, options);
			},
			createWarningNotice(content, options) {
				return createNotice('warning', content, options);
			},
			getNotices: (): WPNotice[] => notices,
		};
	}, [actionCreators, createNotice, notices]);
}
