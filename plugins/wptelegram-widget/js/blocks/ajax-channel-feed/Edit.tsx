import { InspectorControls } from '@wordpress/block-editor';
import type { BlockEditProps } from '@wordpress/blocks';
import { Dashicon, PanelBody, TextControl } from '@wordpress/components';
import { useCallback } from '@wordpress/element';

import { __, sprintf } from '@wpsocio/i18n';

import type { AjaxWidgetAtts } from '../types';
import { Output } from './Output';

const savedSettings = (window.wptelegram_widget?.savedSettings ||
	{}) as AjaxWidgetAtts;

export const Edit: React.FC<BlockEditProps<AjaxWidgetAtts>> = ({
	attributes,
	setAttributes,
	className,
}) => {
	const { widget_width, widget_height, username } = attributes;

	const onChangeWidth = useCallback(
		(newWidth: string) => setAttributes({ widget_width: newWidth }),
		[setAttributes],
	);
	const onChangeHeight = useCallback(
		(newHeight: string) => setAttributes({ widget_height: newHeight }),
		[setAttributes],
	);
	const onChangeUsername = useCallback(
		(newUsername: string) =>
			setAttributes({ username: newUsername?.replace('@', '') }),
		[setAttributes],
	);

	return (
		<>
			<InspectorControls>
				<PanelBody title={__('Widget Options')}>
					<TextControl
						label={__('Username')}
						value={username}
						onChange={onChangeUsername}
						help={sprintf(
							'%s %s',
							__('Channel username.'),
							__('Leave empty for default.'),
						)}
						placeholder={savedSettings?.username || 'WPTelegram'}
					/>
					<TextControl
						label={__('Widget Width')}
						value={widget_width}
						onChange={onChangeWidth}
					/>
					<TextControl
						label={__('Widget Height')}
						value={widget_height}
						onChange={onChangeHeight}
					/>
				</PanelBody>
			</InspectorControls>
			<div className={className}>
				<label>
					<Dashicon icon="shortcode" />
					<span>{__('Telegram Channel Ajax Feed')}</span>
				</label>
				<code className="widget-shortcode">
					<Output attributes={attributes} />
				</code>
			</div>
		</>
	);
};
