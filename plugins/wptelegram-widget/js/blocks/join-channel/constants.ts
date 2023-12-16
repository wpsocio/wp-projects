import type { Block } from '@wordpress/blocks';

import type { JoinChannelAtts } from '../types';

export const blockAttributes: Block<JoinChannelAtts>['attributes'] = {
	link: {
		type: 'string',
	},
	text: {
		type: 'string',
	},
	alignment: {
		type: 'string',
		default: 'center',
	},
};
