import { ToggleControl } from '@wordpress/components';
import { PluginPostStatusInfo as DeprecatedPluginPostStatusInfo } from '@wordpress/edit-post';
import { PluginPostStatusInfo as _PluginPostStatusInfo } from '@wordpress/editor';
import { useEffect } from '@wordpress/element';
import { __ } from '@wpsocio/i18n';

import { OverrideSettings } from './OverrideSettings';
import { useDataState, useUpdateField } from './data';

const wrapperStyle: React.CSSProperties = {
	display: 'flex',
	justifyContent: 'space-between',
	alignItems: 'flex-start',
	width: '100%',
	marginTop: '1rem',
};

const PluginPostStatusInfo =
	_PluginPostStatusInfo || DeprecatedPluginPostStatusInfo;

export const SendToTelegram: React.FC = () => {
	const { data, savedData, isSaving, isDirty } = useDataState();
	const updateField = useUpdateField();

	useEffect(() => {
		if (isDirty && !isSaving && !savedData) {
			updateField('send2tg')(data.send2tg);
		}
	}, [data.send2tg, isDirty, isSaving, savedData, updateField]);

	return (
		<PluginPostStatusInfo
			// @ts-expect-error @wordpress/editor is badly typed
			// biome-ignore lint/correctness/noChildrenProp: Remove it when the issue is fixed
			children={
				<div style={wrapperStyle}>
					<ToggleControl
						// the basic switch
						label={__('Send to Telegram')}
						checked={data.send2tg}
						onChange={updateField('send2tg')}
						__nextHasNoMarginBottom
					/>
					<OverrideSettings />
				</div>
			}
		/>
	);
};
