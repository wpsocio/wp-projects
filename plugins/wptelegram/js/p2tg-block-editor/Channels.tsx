import { BaseControl, CheckboxControl, Flex } from '@wordpress/components';
import { useCallback } from '@wordpress/element';

import { __ } from '@wpsocio/i18n';

import { useDataState, useUpdateField } from './data';

const allChannels = window.wptelegram?.uiData?.allChannels || [];

export const Channels: React.FC = () => {
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
		<BaseControl id="wptg-send-to" label={label} __nextHasNoMarginBottom>
			<Flex
				// biome-ignore lint/a11y/useSemanticElements: It's rendered as a fieldset
				role="group"
				direction="column"
				id="wptg-send-to"
				aria-label={label}
				as="fieldset"
			>
				<CheckboxControl
					checked={allChecked}
					indeterminate={isIndeterminate}
					onChange={(checked) => {
						const newChannels = checked ? allChannels : [];
						updateField('channels')(newChannels);
					}}
					label={__('Select all')}
					__nextHasNoMarginBottom
				/>
				{allChannels.map((channel, index) => {
					return (
						<CheckboxControl
							// biome-ignore lint/suspicious/noArrayIndexKey: it's fine
							key={channel + index}
							label={channel}
							checked={data.channels?.indexOf(channel) !== -1}
							onChange={onChange(channel)}
							__nextHasNoMarginBottom
						/>
					);
				})}
			</Flex>
		</BaseControl>
	);
};
