import { WithDOMData } from '@wpsocio/services';
import type { WPTelegramData } from '../services';

import App from './App';

const dummyDOMData: WPTelegramData = {
	api: {
		admin_url: window.location.href,
		use: 'BROWSER',
	},
	assets: {
		logoUrl: 'https://ps.w.org/wptelegram/assets/icon-128x128.png',
		tgIconUrl: 'https://ps.w.org/wptelegram/assets/icon-128x128.png',
		editProfileUrl: window.location.href,
		botApiLogUrl: window.location.href,
		p2tgLogUrl: window.location.href,
	},
	pluginInfo: {
		name: 'wptelegram',
		title: 'WP Telegram',
		version: '1.2.3',
		description:
			'With this plugin, you can send posts to Telegram and receive notifications and do lot more :)',
	},
	savedSettings: {
		bot_token: '123456789:AbCdEfGhijKlMnOpQrstUvwxYz123456789',
		bot_username: 'testbot',
		p2tg: {
			active: true,
			// @ts-ignore
			channels: ['@hello', '@world'],
			send_when: ['new'],
			post_types: ['post'],
			rules: [],
			excerpt_source: 'post_content',
			excerpt_length: 55,
			image_position: 'before',
			parse_mode: 'none',
			delay: 0,
		},
		notify: {
			active: true,
			parse_mode: 'none',
		},
		proxy: {
			active: true,
			proxy_method: undefined,
			proxy_type: undefined,
		},
		advanced: { enable_logs: [] },
	},
	uiData: {
		debug_info: 'PHP: 7.4.13\nWP: 5.7\nWP Telegram: 3.0.2',
		post_types: [
			{ value: 'post', label: 'Post (post)' },
			{ value: 'page', label: 'Page (page)' },
			{ value: 'product', label: 'Product (product)' },
		],
		rule_types: [
			{ value: 'post', label: 'Post (post)' },
			{ value: 'tax:category', label: 'Category' },
		],
		macros: {
			post: {
				label: 'Post Data',
				macros: [
					'{post_title}',
					'{post_author}',
					'{post_excerpt}',
					'{post_content}',
					'{short_url}',
					'{full_url}',
				],
			},
			terms: {
				label: 'Taxonomy Terms',
				macros: [
					'{tags}',
					'{categories}',
					'{terms:taxonomy}',
					'{terms:product_cat}',
					'{terms:product_tag}',
				],
				info: 'Replace <code>taxonomy</code> in <code>{terms:taxonomy}</code> by the name of the taxonomy to insert its terms attached to the post. For example <code>{terms:product_cat}</code> and <code>{terms:product_tag}</code> in WooCommerce',
			},
			cf: {
				label: 'Custom Fields',
				macros: ['{cf:custom_field}', '{cf:field_name}'],
				info: 'Replace <code>custom_field</code> and <code>field_name</code> in <code>{cf:custom_field}</code> by the name of the Custom Field. For example <code>{cf:rtl_title}</code>, <code>{cf:_regular_price}</code>',
			},
		},
	},
};

export const Main = () => (
	<WithDOMData plugin="wptelegram" data={dummyDOMData}>
		<App />
	</WithDOMData>
);

const story = {
	component: Main,
	title: 'Core/Main',
};

export default story;
