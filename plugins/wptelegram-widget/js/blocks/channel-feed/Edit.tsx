import { InspectorControls, useBlockProps } from '@wordpress/block-editor';
import type { BlockEditProps } from '@wordpress/blocks';
import {
	Dashicon,
	Flex,
	PanelBody,
	RadioControl,
	TextControl,
} from '@wordpress/components';
import { useCallback } from '@wordpress/element';

import { __ } from '@wpsocio/i18n';

import type { LegacyWidgetAtts } from '../types';
import { Output } from './Output';

const getAuthorPhotoOptions = () => [
	{ label: 'Auto', value: 'auto' },
	{ label: 'Always show', value: 'always_show' },
	{ label: 'Always hide', value: 'always_hide' },
];

export const Edit: React.FC<BlockEditProps<LegacyWidgetAtts>> = ({
	attributes,
	setAttributes,
}) => {
	const { widget_width, author_photo, num_messages } = attributes;

	const onChangeAuthorPhoto = useCallback(
		(newStyle: string) =>
			setAttributes({
				author_photo: newStyle as LegacyWidgetAtts['author_photo'],
			}),
		[setAttributes],
	);
	const onChangeWidth = useCallback(
		(newWidth: string) =>
			setAttributes({
				widget_width: newWidth as LegacyWidgetAtts['widget_width'],
			}),
		[setAttributes],
	);
	const onChangeNum = useCallback(
		(newValue: string) =>
			setAttributes({
				num_messages: (Number.parseInt(newValue) || 5).toString(),
			}),
		[setAttributes],
	);

	return (
		<>
			<InspectorControls>
				<PanelBody title={__('Widget Options')}>
					<Flex direction="column" gap={4}>
						<TextControl
							label={__('Widget Width')}
							value={widget_width}
							onChange={onChangeWidth}
							placeholder={`300 ${__('or')} 100%`}
							__nextHasNoMarginBottom
							__next40pxDefaultSize
						/>
						<RadioControl
							label={__('Author Photo')}
							selected={author_photo}
							onChange={onChangeAuthorPhoto}
							options={getAuthorPhotoOptions()}
						/>
						<TextControl
							label={__('Number of Messages')}
							value={num_messages}
							onChange={onChangeNum}
							type="number"
							min="1"
							max="50"
							__nextHasNoMarginBottom
							__next40pxDefaultSize
						/>
					</Flex>
				</PanelBody>
			</InspectorControls>
			<div {...useBlockProps()} key="shortcode">
				<div className="widget-label">
					<Dashicon icon="shortcode" />
					<span>{__('Telegram Channel Feed')}</span>
				</div>
				<code className="widget-shortcode">
					<Output attributes={attributes} />
				</code>
			</div>
		</>
	);
};
