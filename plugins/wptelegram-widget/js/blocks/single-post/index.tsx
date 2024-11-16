import { registerBlockType } from '@wordpress/blocks';

import { __ } from '@wpsocio/i18n';

import { Edit } from './Edit';
import { blockAttributes } from './constants';

registerBlockType('wptelegram/widget-single-post', {
	apiVersion: 3,
	title: __('Telegram Single Post'),
	icon: 'format-aside',
	category: 'wptelegram',
	getEditWrapperProps: (attributes) => {
		const { alignment } = attributes;
		if (['left', 'center', 'right', 'wide', 'full'].includes(alignment)) {
			return { 'data-align': alignment.toString() };
		}
		return { 'data-align': '' };
	},
	attributes: blockAttributes,

	edit: Edit,

	save: ({ attributes }) => {
		const { alignment, iframe_src } = attributes;

		return (
			<div
				className={`wp-block-wptelegram-widget-single-post wptelegram-widget-message align${alignment}`}
			>
				<iframe title={__('Telegram post')} src={iframe_src}>
					Your Browser Does Not Support iframes!
				</iframe>
			</div>
		);
	},
	deprecated: [
		{
			attributes: blockAttributes,
			save: ({ attributes }) => {
				const { alignment, iframe_src } = attributes;

				return (
					<div
						className={`wp-block-wptelegram-widget-single-post wptelegram-widget-message align${alignment}`}
					>
						<iframe src={iframe_src} title={__('Telegram post')}>
							Your Browser Does Not Support iframes!
						</iframe>
					</div>
				);
			},
		},
	],
});
