import type { Block } from '@wordpress/blocks';

import type { TelegramLoginAtts } from './types';

export const blockAttributesV0: Block<TelegramLoginAtts>['attributes'] = {
	button_style: {
		type: 'string',
		default: 'large',
	},
	show_user_photo: {
		type: 'boolean',
		default: true,
	},
	corner_radius: {
		type: 'string',
		default: '20',
	},
	show_if_user_is: {
		type: 'string',
		default: '0',
	},
};

export const blockAttributesV1: Block<TelegramLoginAtts>['attributes'] = {
	button_style: {
		type: 'string',
	},
	show_user_photo: {
		type: 'boolean',
	},
	corner_radius: {
		type: 'string',
	},
	show_if_user_is: {
		type: 'string',
	},
};

export const blockAttributesV2: Block<TelegramLoginAtts>['attributes'] = {
	...blockAttributesV1,
	lang: {
		type: 'string',
	},
};
