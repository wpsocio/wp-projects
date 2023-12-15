export {};

// Add Telegram WebApp object to global namespace in TS.
declare global {
	interface Window {
		Telegram: {
			WebApp: {
				ready: () => void;
				initData: string;
				showPopup: (params: unknown, callback: (id: string) => void) => void;
			};
		};
		wptelegram_web_app_data: {
			is_user_logged_in: boolean;
			confirm_login: boolean;
			login_auth_url: string;
			i18n: Record<string, unknown>;
		};
	}
}
