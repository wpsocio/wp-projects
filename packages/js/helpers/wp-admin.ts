import $ from 'jquery';

/**
 * Cleans up the admin screen by removing all the irrelevant notifications.
 */
export function cleanupAdminScreen(
	removeSiblingsOf = '',
	disableFormCSS = false,
) {
	const id = removeSiblingsOf?.replace(/^#?/, '#');
	$(() => {
		if (id && $(id).length) {
			$(id).siblings().remove();
		}
		if (disableFormCSS) {
			$('#forms-css').prop('disabled', true);
		}
	});
}
