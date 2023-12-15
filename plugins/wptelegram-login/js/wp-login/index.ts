import $ from 'jquery';

import './style.scss';

$(() => {
	$('form[name="loginform"],form[name="registerform"]').each(function () {
		const form = $(this);
		const overflow = $('<div class="wptelegram-login-clear"></div>');

		const forgetmenot = form.find('p.forgetmenot');
		const submit = form.find('p.submit');

		// Set the form styles.
		form.css({ position: 'relative' });

		// Append the overflow
		form.append(overflow);
		// Append submit buttons
		overflow.append(forgetmenot, submit);

		// manipulate login wrap
		const loginWrap = form.find('#wptelegram-login-wrap');
		loginWrap.css('display', 'block');
		form.append(loginWrap);
	});
});
