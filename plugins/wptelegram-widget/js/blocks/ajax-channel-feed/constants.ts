import type { Block } from '@wordpress/blocks';

import type { AjaxWidgetAtts } from '../types';

export const blockAttributes: Block<AjaxWidgetAtts>['attributes'] = {
	username: {
		type: 'string',
		default: '',
	},
	widget_width: {
		type: 'string',
		default: '100%',
	},
	widget_height: {
		type: 'string',
		default: '600',
	},
};
