import {
	BlockAlignmentToolbar,
	BlockControls,
	InspectorControls,
} from '@wordpress/block-editor';
import {
	PanelBody,
	ToggleControl,
	ToolbarButton,
	ToolbarGroup,
} from '@wordpress/components';
import { Fragment } from '@wordpress/element';
import { __ } from '@wpsocio/i18n';

export type ControlsProps = {
	userpic: boolean;
	toggleUserPic: VoidFunction;
	showEditButton: boolean;
	switchBackToURLInput: VoidFunction;
	alignment: NonNullable<BlockAlignmentToolbar.Props['controls']>[number];
	changeAlignment: NonNullable<BlockAlignmentToolbar.Props['onChange']>;
};

export const Controls: React.FC<ControlsProps> = (props) => {
	const {
		userpic,
		toggleUserPic,
		showEditButton,
		switchBackToURLInput,
		alignment,
		changeAlignment,
	} = props;

	return (
		<Fragment>
			<InspectorControls>
				<PanelBody title={__('Options')}>
					<ToggleControl
						label={__('Author Photo')}
						checked={userpic}
						onChange={toggleUserPic}
					/>
				</PanelBody>
			</InspectorControls>
			<BlockControls>
				<BlockAlignmentToolbar value={alignment} onChange={changeAlignment} />
				<ToolbarGroup>
					{showEditButton && (
						<ToolbarButton
							className="components-toolbar__control"
							title={__('Edit URL')}
							icon="edit"
							onClick={switchBackToURLInput}
						/>
					)}
				</ToolbarGroup>
			</BlockControls>
		</Fragment>
	);
};
