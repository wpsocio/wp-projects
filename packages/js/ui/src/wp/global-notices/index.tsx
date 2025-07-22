/**
 * Inspired by the same component in Jetpack.
 */
import { SnackbarList } from '@wordpress/components';
import styles from './styles.module.scss';
import { useGlobalNotices } from './use-global-notices.js';

export type GlobalNoticesProps = {
	maxVisibleNotices?: number;
};

/**
 * Renders the global notices.
 */
export function GlobalNotices({ maxVisibleNotices = 3 }: GlobalNoticesProps) {
	const { getNotices, removeNotice } = useGlobalNotices();

	const snackbarNotices = getNotices()
		// Filter to only include snackbar notices.
		// @ts-expect-error - The type is not correctly inferred.
		.filter(({ type }) => type === 'snackbar')
		// Slices from the tail end of the list.
		.slice(-maxVisibleNotices);

	return (
		<SnackbarList
			notices={snackbarNotices}
			className={styles['global-notices']}
			onRemove={removeNotice}
		/>
	);
}

export * from './use-global-notices.js';
