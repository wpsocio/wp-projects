import {
	Button,
	Disabled,
	Modal,
	TextControl,
	TextareaControl,
	ToggleControl,
} from '@wordpress/components';
import type { ModalProps } from '@wordpress/components/build-types/modal/types';
import { useCallback, useState } from '@wordpress/element';
import { __, sprintf } from '@wpsocio/i18n';
import type { CSSProperties } from 'react';
import { Channels } from './Channels';
import { Files } from './Files';
import { GearIcon } from './GearIcon';
import { useDataState, useUpdateField } from './data';

const modalStyles: CSSProperties = {
	width: '100%',
	maxWidth: '650px',
};

const bodyStyles: CSSProperties = {
	display: 'flex',
	flexDirection: 'column',
	justifyContent: 'space-between',
};

const buttonStyles: CSSProperties = {
	width: '100%',
	justifyContent: 'center',
	marginTop: '2em',
};

const separatorStyles: CSSProperties = {
	height: '1.5em',
};

export const OverrideSettings: React.FC = () => {
	const { data } = useDataState();
	const updateField = useUpdateField();

	const [isOpen, setOpen] = useState(false);
	const openModal = useCallback(() => setOpen(true), []);
	const closeModal = useCallback(() => setOpen(false), []);

	const onRequestClose = useCallback<ModalProps['onRequestClose']>(
		(event) => {
			// Prevent modal close on media upload
			if (
				event?.target &&
				'id' in event.target &&
				event?.target?.id === 'wptg-upload-media'
			) {
				return;
			}
			closeModal();
		},
		[closeModal],
	);

	const separator = <div style={separatorStyles} />;

	const disableInputs = !data.override_switch;

	return (
		<>
			<Button
				aria-label={__('Override settings')}
				disabled={!data.send2tg}
				icon={<GearIcon />}
				size="small"
				onClick={openModal}
			/>
			{isOpen && (
				<Modal
					isDismissible={false}
					title={sprintf(
						'%s (%s)',
						__('Post to Telegram'),
						__('Override settings'),
					)}
					onRequestClose={onRequestClose}
					style={modalStyles}
				>
					<div style={bodyStyles}>
						<div>
							<ToggleControl
								label={__('Override settings')}
								checked={data.override_switch}
								onChange={updateField('override_switch')}
								__nextHasNoMarginBottom
							/>
							<Disabled
								isDisabled={disableInputs}
								style={{ opacity: disableInputs ? 0.3 : 1 }}
							>
								{separator}
								<Channels />
								{separator}
								<Files />
								{separator}
								<ToggleControl
									label={__('Disable Notifications')}
									checked={data.disable_notification}
									onChange={updateField('disable_notification')}
									__nextHasNoMarginBottom
								/>
								{separator}
								<TextControl
									label={__('Delay in Posting')}
									value={data.delay || '0.5'}
									onChange={updateField('delay')}
									step="0.5"
									min={0}
									type="number"
									__nextHasNoMarginBottom
								/>
								{separator}
								<ToggleControl
									label={__('Featured Image')}
									checked={data.send_featured_image}
									onChange={updateField('send_featured_image')}
									help={__('Send Featured Image (if exists).')}
									__nextHasNoMarginBottom
								/>
								{separator}
								<TextareaControl
									label={__('Message Template')}
									value={data.message_template || ''}
									onChange={updateField('message_template')}
									rows={10}
									__nextHasNoMarginBottom
								/>
							</Disabled>
						</div>

						<Button style={buttonStyles} variant="primary" onClick={closeModal}>
							{__('Save Changes')}
						</Button>
					</div>
				</Modal>
			)}
		</>
	);
};
