import './types';

window.Telegram.WebApp.ready();

function getRedirectURL() {
	const current_url = new URL(window.location.href);
	current_url.hash = '';
	current_url.searchParams.delete('action');
	return current_url.toString();
}

function getLoginURL(auth_url: string, auth_data: string) {
	const login_url = new URL(auth_url);

	if (!login_url.searchParams.has('redirect_to')) {
		login_url.searchParams.set('redirect_to', getRedirectURL());
	}

	const initDataSearchParams = new URLSearchParams(auth_data);

	for (const [key, value] of initDataSearchParams.entries()) {
		login_url.searchParams.set(key, value);
	}

	return login_url.toString();
}

(({ is_user_logged_in, login_auth_url, confirm_login, i18n }, webApp) => {
	if (!is_user_logged_in && webApp.initData) {
		const login = () => {
			// Redirect the user to login URL.
			window.location.href = getLoginURL(login_auth_url, webApp.initData);
		};
		if (confirm_login) {
			webApp.showPopup(i18n.popup, (id) => {
				if (id === 'login') {
					login();
				}
			});
		} else {
			login();
		}
	}
})(window.wptelegram_web_app_data, window.Telegram.WebApp);
