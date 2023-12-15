import { SectionCard } from '@wpsocio/components';
import { FormField } from '@wpsocio/form';
import { __ } from '@wpsocio/i18n';

import { getFieldLabel, useData } from '../services';

const getButtonStyleOptions = () => [
	{ value: 'large', label: __('Large') },
	{ value: 'medium', label: __('Medium') },
	{ value: 'small', label: __('Small') },
];

export const ButtonOptions = () => {
	const { uiData } = useData();

	return (
		<SectionCard title={__('Button Options')}>
			<FormField
				fieldType="radio"
				isInline
				label={getFieldLabel('button_style')}
				name="button_style"
				options={getButtonStyleOptions()}
			/>
			<FormField
				description={__('Display Telegram user profile photo beside button.')}
				fieldType="switch"
				label={getFieldLabel('show_user_photo')}
				name="show_user_photo"
			/>
			<FormField
				description={__('Leave empty for default.')}
				fieldType="number"
				label={getFieldLabel('corner_radius')}
				max={20}
				maxWidth="100px"
				min={1}
				name="corner_radius"
			/>
			<FormField
				description={__('Language for the login button.')}
				fieldType="select"
				label={getFieldLabel('lang')}
				name="lang"
				options={uiData.lang}
			/>
			<FormField
				description={__('Who can see the login button.')}
				fieldType="select"
				label={getFieldLabel('show_if_user_is')}
				name="show_if_user_is"
				options={uiData.show_if_user_is}
			/>
			<FormField
				description={__(
					'Hide the button on default WordPress login/register page.',
				)}
				fieldType="switch"
				label={getFieldLabel('hide_on_default')}
				name="hide_on_default"
			/>
		</SectionCard>
	);
};
