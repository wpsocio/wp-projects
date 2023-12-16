import type { Block } from '@wordpress/blocks';

import type { LegacyWidgetAtts } from '../types';

export const blockAttributes: Block<LegacyWidgetAtts>['attributes'] = {
	widget_width: {
		type: 'string',
		default: '100',
	},
	author_photo: {
		type: 'string',
		default: 'auto',
	},
	num_messages: {
		type: 'string',
		default: '5',
	},
};
