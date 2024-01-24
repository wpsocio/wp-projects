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
			const wasSelectedBefore = data.channels?.indexOf(channel) !== -1;
			const newChannels = wasSelectedBefore
				? data.channels?.filter((c) => c !== channel)
				: [...(data.channels || []), channel];
			updateField('channels')(newChannels);
		},
		[data.channels, updateField],
	);

	const allChecked = allChannels.every(
		(channel) => data.channels?.indexOf(channel) !== -1,
	);
	const isIndeterminate =
		!allChecked &&
		allChannels.some((channel) => data.channels?.indexOf(channel) !== -1);

	const selectedChannels =
		allChannels.length > 5
			? `(${data.channels?.length || 0}/${allChannels.length})`
			: '';

	const label = `${__('Send to')} ${selectedChannels}`;

	return (
		<BaseControl id="wptg-send-to" label={label}>
			<div role="group" id="wptg-send-to" aria-label={label}>
				<CheckboxControl
					checked={allChecked}
					indeterminate={isIndeterminate}
					onChange={(checked) => {
						const newChannels = checked ? allChannels : [];
						updateField('channels')(newChannels);
					}}
					label={__('Select all')}
				/>
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
