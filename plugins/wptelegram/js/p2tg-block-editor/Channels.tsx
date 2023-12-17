import { BaseControl, CheckboxControl } from '@wordpress/components';
import { useCallback } from '@wordpress/element';

import { __ } from '@wpsocio/i18n';

import { useDataState, useUpdateField } from './data';

const allChannels = window.wptelegram?.uiData?.allChannels || [];

export const Channels: React.FC<{ isDisabled?: boolean }> = ({
	isDisabled,
}) => {
	const { data } = useDataState();
	const updateField = useUpdateField();

	const onChange = useCallback(
		(channel: string) => () => {
			const hasChannel = data.channels?.indexOf(channel) !== -1;
			const newChannels = hasChannel
				? data.channels?.filter((c) => c !== channel)
				: [...(data.channels || []), channel];
			updateField('channels')(newChannels);
		},
		[data.channels, updateField],
	);

	return (
		<BaseControl id="wptg-send-to" label={__('Send to')}>
			<div role="group" id="wptg-send-to" aria-label={__('Send to')}>
				{allChannels.map((channel, index) => {
					return (
						<CheckboxControl
							key={channel + index}
							label={channel}
							disabled={isDisabled}
							checked={data.channels?.indexOf(channel) !== -1}
							onChange={onChange(channel)}
						/>
					);
				})}
			</div>
		</BaseControl>
	);
};
