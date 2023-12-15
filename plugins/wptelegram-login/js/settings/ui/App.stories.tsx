import { WithDOMData } from '@wpsocio/services';
import type { WPTelegramLoginData } from '../services';

import App from './App';

const dummyDOMData: WPTelegramLoginData = {
	api: {
		admin_url: window.location.href,
		use: 'BROWSER',
	},
	assets: {
		logoUrl: 'https://ps.w.org/wptelegram/assets/icon-128x128.png',
		tgIconUrl: 'https://ps.w.org/wptelegram/assets/icon-128x128.png',
	},
	pluginInfo: {
		name: 'wptelegram_login',
		title: 'WP Telegram Login',
		version: '1.2.3',
		description:
			'With this plugin, you can let the users login to your website with their Telegram and make it simple for them to get connected.',
	},
	savedSettings: {
		avatar_meta_key: 'wptg_login_avatar',
		bot_token: '123456789:hYtGfDrErt9ejYZ8cANGLgeD1b1wZ7DsTLk',
		bot_username: 'testbot',
		button_style: 'medium',
		disable_signup: false,
		random_email: false,
		redirect_to: 'default',
		user_role: 'subscriber',
		corner_radius: '',
	},
	uiData: {
		user_role: [
			{ value: 'subscriber', label: 'Subscriber' },
			{ value: 'author', label: 'Author' },
		],
		lang: [
			{ value: '', label: 'Default' },
			{ value: 'en', label: 'English' },
		],
		show_if_user_is: [
			{ value: '0', label: 'Any' },
			{ value: 'author', label: 'Author' },
			{ value: 'logged_in', label: 'Logged in' },
			{ value: 'logged_out', label: 'Logged out' },
		],
	},
	i18n: {
		'': {
			domain: '',
			lang: 'en',
		},
	},
};

export const Main = () => (
	<WithDOMData plugin="wptelegram_login" data={dummyDOMData}>
		<App />
	</WithDOMData>
);

const story = {
	component: Main,
	title: 'Login/Main',
};

export default story;
