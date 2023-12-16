import { registerBlockType } from '@wordpress/blocks';

import { __ } from '@wpsocio/i18n';

import { Edit } from './Edit';
import { blockAttributes } from './constants';

import './style.scss';

registerBlockType('wptelegram/widget-single-post', {
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
				<iframe
					title="Telegram post"
					frameBorder="0"
					scrolling="no"
					src={iframe_src}
				>
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
						{
							<iframe frameBorder="0" scrolling="no" src={iframe_src} title=" ">
								Your Browser Does Not Support iframes!
							</iframe>
						}
					</div>
				);
			},
		},
	],
});
