export default {};

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
	}
}
