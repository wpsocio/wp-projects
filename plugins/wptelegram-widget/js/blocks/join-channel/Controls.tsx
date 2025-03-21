import {
	BlockAlignmentToolbar,
	BlockControls,
	InspectorControls,
} from '@wordpress/block-editor';
import { Flex, PanelBody, TextControl } from '@wordpress/components';
import { Fragment, useCallback, useEffect } from '@wordpress/element';

import { __ } from '@wpsocio/i18n';

import { getDomData } from '../getDomData';
import type { JoinChannelAtts } from '../types';

export type ControlsProps = {
	setAttributes: (newAttributes: Partial<JoinChannelAtts>) => void;
	attributes: JoinChannelAtts;
};

export const Controls: React.FC<ControlsProps> = ({
	setAttributes,
	attributes,
}) => {
	const { alignment, link, text } = attributes;

	const { join_link_text, join_link_url } = getDomData('uiData');

	useEffect(() => {
		if (!link) {
			setAttributes({ link: join_link_url });
		}
		if (!text) {
			setAttributes({ text: join_link_text });
		}
	}, []);

	const onChangeChannelLink = useCallback(
		(newValue: string) => setAttributes({ link: newValue }),
		[setAttributes],
	);
	const onChangeButtonText = useCallback(
		(newValue: string) => setAttributes({ text: newValue }),
		[setAttributes],
	);
	const onChangeAlign = useCallback(
		(align: JoinChannelAtts['alignment']) =>
			setAttributes({ alignment: align }),
		[setAttributes],
	);

	return (
		<Fragment>
			<InspectorControls key="controls">
				<PanelBody title={__('Button details')}>
					<Flex direction="column" gap={4}>
						<TextControl
							label={__('Channel Link')}
							value={link || ''}
							onChange={onChangeChannelLink}
							type="url"
							__nextHasNoMarginBottom
							__next40pxDefaultSize
						/>
						<TextControl
							label={__('Button text')}
							value={text || ''}
							onChange={onChangeButtonText}
							__nextHasNoMarginBottom
							__next40pxDefaultSize
						/>
					</Flex>
				</PanelBody>
			</InspectorControls>
			<BlockControls>
				<BlockAlignmentToolbar value={alignment} onChange={onChangeAlign} />
			</BlockControls>
		</Fragment>
	);
};
