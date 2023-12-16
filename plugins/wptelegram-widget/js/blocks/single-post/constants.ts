import type { Block } from '@wordpress/blocks';

import type { SinglePostAtts } from '../types';

export const blockAttributes: Block<SinglePostAtts>['attributes'] = {
	url: {
		type: 'string',
		default: '',
	},
	iframe_src: {
		type: 'string',
		default: '',
	},
	userpic: {
		type: 'boolean',
		default: true,
	},
	alignment: {
		type: 'string',
		default: 'center',
	},
};
