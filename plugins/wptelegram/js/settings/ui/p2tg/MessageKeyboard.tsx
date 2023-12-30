import {
	Code,
	FeildStack,
	FeildStackItem,
	SectionCard,
} from '@wpsocio/components';
import { FormField, useWatch } from '@wpsocio/form';
import { __, sprintf } from '@wpsocio/i18n';
import { createInterpolateElement } from '@wpsocio/utilities';

import { DataShape, getFieldLabel } from './../../services';
import { Upsell } from './../shared/Upsell';
import { PREFIX } from './constants';

export const MessageKeyboard: React.FC = () => {
	const isDisabled = !useWatch({
		name: `${PREFIX}.inline_url_button` as const,
	});

	return (
		<SectionCard title={__('Inline Keyboard')}>
			<FeildStack>
				<FeildStackItem>
					<FormField
						description={__(
							'Add an inline clickable button for the post URL just below the message.',
						)}
						fieldType="switch"
						label={getFieldLabel('inline_url_button')}
						name={`${PREFIX}.inline_url_button`}
						controlClassName="no-flex"
					/>
				</FeildStackItem>
				<FeildStackItem>
					<FormField
						fieldType="text"
						isDisabled={isDisabled}
						label={getFieldLabel('inline_button_text')}
						maxWidth="200px"
						name={`${PREFIX}.inline_button_text`}
						placeholder={__('View Post')}
						controlClassName="no-flex"
					/>
				</FeildStackItem>
				<FeildStackItem>
					<FormField
						after={createInterpolateElement(
							sprintf(
								/* translators: template tag/macro */
								__('You can specify any custom field like %s.'),
								'<Macro />',
							),
							{ Macro: <Code whiteSpace="nowrap">{'{cf:_product_url}'}</Code> },
						)}
						description={__('Source of the button URL.')}
						fieldType="text"
						isDisabled={isDisabled}
						label={getFieldLabel('inline_button_url')}
						maxWidth="400px"
						name={`${PREFIX}.inline_button_url`}
						placeholder="{full_url}"
						controlClassName="no-flex"
					/>
				</FeildStackItem>
			</FeildStack>
			<Upsell location="inline-button" />
		</SectionCard>
	);
};
