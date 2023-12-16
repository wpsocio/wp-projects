import { WithDOMData } from '@wpsocio/services';
import type { WPTelegramWidgetData } from '../services';

import App from './App';

const dummyDOMData: WPTelegramWidgetData = {
	api: {
		admin_url: window.location.href,
		use: 'BROWSER',
	},
	assets: {
		logoUrl: 'https://ps.w.org/wptelegram/assets/icon-128x128.png',
		tgIconUrl: 'https://ps.w.org/wptelegram/assets/icon-128x128.png',
		pullUpdatesUrl: window.location.href,
	},
	pluginInfo: {
		name: 'wptelegram_widget',
		title: 'WP Telegram Widget',
		version: '1.2.3',
		description:
			'With this plugin, you can display your public Telegram Channel or Group feed in a WordPress widget or anywhere else using a shortcode.',
	},
	savedSettings: {
		ajax_widget: { username: '' },
		legacy_widget: {},
		join_link: {
			text: 'Join @WPTelegramChat on Telegram',
			url: 'https://t.me/WPTelegramChat',
			bgcolor: '#389ce9',
			text_color: '#fff',
			position: 'after_content',
			priority: '10',
			post_types: [],
		},
		advanced: {},
	},
	uiData: {
		post_types: [
			{ value: 'post', label: 'Post (post)' },
			{ value: 'page', label: 'Page (page)' },
			{ value: 'product', label: 'Product (product)' },
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
	<WithDOMData plugin="wptelegram_widget" data={dummyDOMData}>
		<App />
	</WithDOMData>
);

const story = {
	component: Main,
	title: 'Widget/Main',
};

export default story;
