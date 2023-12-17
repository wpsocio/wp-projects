import { ToggleControl } from '@wordpress/components';
import { PluginPostStatusInfo } from '@wordpress/edit-post';
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

export const SendToTelegram: React.FC = () => {
	const { data, savedData, isSaving, isDirty } = useDataState();
	const updateField = useUpdateField();

	useEffect(() => {
		if (isDirty && !isSaving && !savedData) {
			updateField('send2tg')(data.send2tg);
		}
	}, [data.send2tg, isDirty, isSaving, savedData, updateField]);

	return (
		<PluginPostStatusInfo>
			<div style={wrapperStyle}>
				<ToggleControl
					// the basic switch
					label={__('Send to Telegram')}
					checked={data.send2tg}
					onChange={updateField('send2tg')}
				/>
				<OverrideSettings />
			</div>
		</PluginPostStatusInfo>
	);
};
