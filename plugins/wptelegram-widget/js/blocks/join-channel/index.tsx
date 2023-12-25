import { useBlockProps } from '@wordpress/block-editor';
import { registerBlockType } from '@wordpress/blocks';

import { __ } from '@wpsocio/i18n';

import { Controls } from './Controls';
import { JoinButton } from './JoinButton';
import { TelegramIcon } from './TelegramIcon';

import { blockAttributes } from './constants';

import './style.scss';

registerBlockType('wptelegram/widget-join-channel', {
	apiVersion: 3,
	title: __('Join Telegram Channel'),
	icon: <TelegramIcon fill="#555d66" />,
	category: 'wptelegram',
	attributes: blockAttributes,
	getEditWrapperProps: (attributes) => {
		const { alignment } = attributes;
		if (['left', 'center', 'right', 'wide', 'full'].includes(alignment)) {
			return { 'data-align': alignment };
		}
		return { 'data-align': '' };
	},
	edit: ({ attributes, setAttributes }) => {
		const blockProps = useBlockProps({
			className: `align${attributes.alignment}`,
		});

		return (
			<div {...blockProps}>
				<Controls attributes={attributes} setAttributes={setAttributes} />
				<JoinButton {...attributes} isEditing />
			</div>
		);
	},
	// Save is handled by PHP via render_callback
	// because WP blocks sometimes suck big time
	// by failing block validation for no reason
	// save: null
	/* save: ({ attributes }) => {
		const blockProps = useBlockProps.save();

		return (
			<div
				{...blockProps}
				className={`wp-block-wptelegram-widget-join-channel align${attributes.alignment}`}
			>
				<JoinButton {...attributes} />
			</div>
		);
	}, */
	deprecated: [
		{
			attributes: blockAttributes,
			save() {
				return null;
			},
		},
	],
});
