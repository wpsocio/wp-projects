import { __, sprintf, isRTL } from '@wpsocio/i18n';
import { Text, List, ListItem } from '@wpsocio/adapters';
import { FormField, useWatch } from '@wpsocio/form';
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
	const [disable_preview, image_position, parse_mode, single_message] =
		useWatch({
			name: [
				prefixName('disable_web_page_preview', prefix),
				prefixName('image_position', prefix),
				prefixName('parse_mode', prefix),
				prefixName('single_message', prefix),
			],
		});

	const showWarning =
		single_message &&
		image_position === 'after' &&
		(parse_mode === 'none' || disable_preview);

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
							{disable_preview && (
								<ListItem color="red.500">
									{createInterpolateElement(
										sprintf(
											/* translators: 1 - field name */
											__('%s should not be enabled.'),
											'<DisablePreview />',
										),
										{
											DisablePreview: (
												<b>{getFieldLabel('disable_web_page_preview')}</b>
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
