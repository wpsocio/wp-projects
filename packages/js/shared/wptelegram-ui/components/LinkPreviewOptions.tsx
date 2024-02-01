import { Code, FeildStack, FeildStackItem } from '@wpsocio/components';
import { FormField, useWatch } from '@wpsocio/form';
import { __, sprintf } from '@wpsocio/i18n';
import { createInterpolateElement, prefixName } from '@wpsocio/utilities';

import { getFieldLabel } from '../services';
import type { CommonProps } from './types';

export const LinkPreviewOptions: React.FC<CommonProps> = ({ prefix }) => {
	const link_preview_disabled = useWatch({
		name: prefixName('link_preview_disabled', prefix),
	});

	return (
		<FeildStack>
			<FeildStackItem>
				<FormField
					name={prefixName('link_preview_disabled', prefix)}
					fieldType="switch"
					label={getFieldLabel('link_preview_disabled')}
					description={__('Disables previews for links in the messages.')}
					controlClassName="no-flex"
				/>
			</FeildStackItem>
			<FeildStackItem>
				<FormField
					name={prefixName('link_preview_url', prefix)}
					fieldType="text"
					label={getFieldLabel('link_preview_url')}
					isDisabled={link_preview_disabled}
					description={
						<>
							{__('URL to use for the link preview.')}
							&nbsp;
							{createInterpolateElement(
								sprintf(
									/* translators: %s code example */
									__('For example %s'),
									'<Ex />',
								),
								{
									Ex: <Code>{'{full_url}'}</Code>,
								},
							)}
						</>
					}
					controlClassName="no-flex"
					placeholder="{full_url}"
				/>
			</FeildStackItem>
			<FeildStackItem>
				<FormField
					name={prefixName('link_preview_above_text', prefix)}
					fieldType="switch"
					label={getFieldLabel('link_preview_above_text')}
					isDisabled={link_preview_disabled}
					description={__(
						'Whether the link preview must be shown above the message text.',
					)}
					controlClassName="no-flex"
				/>
			</FeildStackItem>
		</FeildStack>
	);
};
