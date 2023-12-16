import { registerBlockType } from '@wordpress/blocks';
import { __ } from '@wpsocio/i18n';

import { Edit } from './Edit';
import { Output } from './Output';
import { blockAttributes } from './constants';

import './style.scss';

registerBlockType('wptelegram/widget-channel-feed', {
	title: __('Telegram Channel Feed'),
	icon: 'format-aside',
	category: 'wptelegram',
	attributes: blockAttributes,
	edit: Edit,
	save: ({ attributes }) => {
		return (
			<div>
				<Output attributes={attributes} />
			</div>
		);
	},
});
