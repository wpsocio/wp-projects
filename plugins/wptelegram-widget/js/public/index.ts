import $ from 'jquery';

import './style.scss';

$(() => {
	const iframe = $('.wptelegram-widget-message iframe');

	iframe.on('resize_iframe', function () {
		const $this = $(this);
		const height = $this.contents().find('body').height();

		if (height) {
			// Add 2px to the height to avoid hidden borders
			$this.height((height + 2).toString());
		}
	});

	iframe.on('load', function () {
		const $this = $(this);
		if ($this.contents().find('body').is(':empty')) {
			$this.parent().remove();
		} else {
			$this.trigger('resize_iframe');
		}
	});

	$(window).on('resize', () => {
		iframe.trigger('resize_iframe');
	});
});
