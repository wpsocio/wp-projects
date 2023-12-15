import { registerBlockType } from '@wordpress/blocks';

import { __ } from '@wpsocio/i18n';

import { Edit } from './Edit';
import { Output } from './Output';
import {
	blockAttributesV0,
	blockAttributesV1,
	blockAttributesV2,
} from './constants';
import type { TelegramLoginAtts } from './types';

import './style.scss';

const savedSettings = (window.wptelegram_login?.savedSettings ||
	{}) as TelegramLoginAtts;

registerBlockType<TelegramLoginAtts>('wptelegram/login', {
	title: __('WP Telegram Login'),
	icon: 'smartphone',
	category: 'wptelegram',
	attributes: blockAttributesV2,
	edit: Edit,

	save(props) {
		return <Output attributes={props.attributes} className="" />;
	},
	deprecated: [
		{
			attributes: blockAttributesV0,
			save(props) {
				return <Output attributes={props.attributes} className="" />;
			},
		},
		{
			attributes: blockAttributesV1,
			migrate(attributes) {
				return { ...savedSettings, ...attributes };
			},
			save(props) {
				return <Output attributes={props.attributes} className="" />;
			},
		},
		{
			attributes: blockAttributesV2,
			migrate(attributes) {
				return { ...savedSettings, ...attributes };
			},
			save(props) {
				return <Output attributes={props.attributes} className="" />;
			},
		},
	],
});
