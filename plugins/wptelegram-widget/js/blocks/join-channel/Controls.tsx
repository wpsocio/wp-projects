import {
	BlockAlignmentToolbar,
	BlockControls,
	InspectorControls,
} from '@wordpress/block-editor';
import { PanelBody, TextControl } from '@wordpress/components';
import { Fragment, useCallback, useEffect } from '@wordpress/element';

import { __ } from '@wpsocio/i18n';

import type { JoinChannelAtts } from '../types';
import { useData } from '../useData';

export type ControlsProps = {
	setAttributes: (newAttributes: Partial<JoinChannelAtts>) => void;
	attributes: JoinChannelAtts;
};

export const Controls: React.FC<ControlsProps> = ({
	setAttributes,
	attributes,
}) => {
	const { alignment, link, text } = attributes;

	const { join_link_text, join_link_url } = useData('uiData');

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
					<TextControl
						label={__('Channel Link')}
						value={link || ''}
						onChange={onChangeChannelLink}
						type="url"
					/>
					<TextControl
						label={__('Button text')}
						value={text || ''}
						onChange={onChangeButtonText}
					/>
				</PanelBody>
			</InspectorControls>
			<BlockControls>
				<BlockAlignmentToolbar value={alignment} onChange={onChangeAlign} />
			</BlockControls>
		</Fragment>
	);
};
