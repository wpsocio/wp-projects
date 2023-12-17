import $ from 'jquery';

// DOM selectors
const OVERRIDE_SWITCH =
	'input[type="checkbox"][name="_wptg_p2tg_override_switch"]';
const POST_EDIT_PAGE = '.wp-admin.post-php,.wp-admin.post-new-php';
const DEPENDENT_FIELDS = '.cmb-row.depends-upon-override_switch';
const METABOX = '#wptelegram_p2tg_override';

$(() => {
	const metabox = $(POST_EDIT_PAGE).find(METABOX);

	metabox.on('change', OVERRIDE_SWITCH, function () {
		const fields = metabox.find(DEPENDENT_FIELDS);

		if ($(this).is(':checked')) {
			fields.show(300);
		} else {
			fields.hide(300);
		}
	});

	metabox.find(OVERRIDE_SWITCH).trigger('change');
});
