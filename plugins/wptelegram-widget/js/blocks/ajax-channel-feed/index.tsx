import { useBlockProps } from '@wordpress/block-editor';
import { registerBlockType } from '@wordpress/blocks';
import { __ } from '@wpsocio/i18n';

import type { AjaxWidgetAtts } from '../types';
import { Edit } from './Edit';
import { Output } from './Output';
import { blockAttributes } from './constants';

import './style.scss';

registerBlockType<AjaxWidgetAtts>('wptelegram/widget-ajax-channel-feed', {
	apiVersion: 3,
	title: __('Telegram Channel Ajax Feed'),
	icon: 'format-aside',
	category: 'wptelegram',
	attributes: blockAttributes,
	edit: Edit,
	save: ({ attributes }) => {
		return (
			<div {...useBlockProps.save()}>
				<Output attributes={attributes} />
			</div>
		);
	},
});
