import { WithDOMData } from '@wpsocio/services';
import type { WPTelegramCommentsData } from '../services';

import App from './App';

const dummyDOMData: WPTelegramCommentsData = {
	api: {},
	assets: {
		logoUrl: 'https://ps.w.org/wptelegram/assets/icon-128x128.png',
		tgIconUrl: 'https://ps.w.org/wptelegram/assets/icon-128x128.png',
	},
	pluginInfo: {
		name: 'wptelegram_comments',
		title: 'WP Telegram Comments',
		version: '1.2.3',
		description:
			'With this plugin, you can add comments to posts/pages on your WordPress website by using Telegram Comments Widget.',
	},
	savedSettings: {
		code: '',
		post_types: ['post'],
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
	<WithDOMData plugin="wptelegram_comments" data={dummyDOMData}>
		<App />
	</WithDOMData>
);

const story = {
	component: Main,
	title: 'Comments/Main',
};

export default story;
