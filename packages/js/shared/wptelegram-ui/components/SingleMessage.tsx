import { List, ListItem, Text } from '@wpsocio/adapters';
import { FormField, useWatch } from '@wpsocio/form';
import { __, isRTL, sprintf } from '@wpsocio/i18n';
import { createInterpolateElement, prefixName } from '@wpsocio/utilities';

import { getFieldLabel } from '../services';
import type { CommonProps } from './types';

export interface SingleMessageProps extends CommonProps {
	isDisabled?: boolean;
}

export const SingleMessage: React.FC<SingleMessageProps> = ({
	isDisabled,
	prefix,
}) => {
	const [link_preview_disabled, image_position, parse_mode, single_message] =
		useWatch({
			name: [
				prefixName('link_preview_disabled', prefix),
				prefixName('image_position', prefix),
				prefixName('parse_mode', prefix),
				prefixName('single_message', prefix),
			],
		});

	const showWarning =
		single_message &&
		image_position === 'after' &&
		(parse_mode === 'none' || link_preview_disabled);

	return (
		<FormField
			description={__('Send both text and image in single message.')}
			fieldType="switch"
			isDisabled={isDisabled}
			label={getFieldLabel('single_message')}
			name={prefixName('single_message', prefix)}
			controlClassName="no-flex"
			after={
				showWarning && (
					<>
						<Text>
							{isRTL() ? '👈' : '👉'}&nbsp;
							{createInterpolateElement(
								sprintf(
									/* translators: 1 - field name, 2 - value */
									__('When %1$s is set to %2$s:'),
									'<ImagePosition />',
									'<Value />',
								),
								{
									ImagePosition: <b>{getFieldLabel('image_position')}</b>,
									Value: <b>{__('After the Text')}</b>,
								},
							)}
						</Text>
						<List styleType="circle" ms="3em">
							{parse_mode === 'none' && (
								<ListItem color="red.500">
									{createInterpolateElement(
										sprintf(
											/* translators: 1 - field name, 2 - value */
											__('%1$s should not be %2$s.'),
											'<ParseMode />',
											'<Value />',
										),
										{
											ParseMode: <b>{getFieldLabel('parse_mode')}</b>,
											Value: <b>{__('None')}</b>,
										},
									)}
								</ListItem>
							)}
							{link_preview_disabled && (
								<ListItem color="red.500">
									{createInterpolateElement(
										sprintf(
											/* translators: 1 - field name */
											__('%s should not be enabled.'),
											'<DisablePreview />',
										),
										{
											DisablePreview: (
												<b>{getFieldLabel('link_preview_disabled')}</b>
											),
										},
									)}
								</ListItem>
							)}
						</List>
					</>
				)
			}
		/>
	);
};
