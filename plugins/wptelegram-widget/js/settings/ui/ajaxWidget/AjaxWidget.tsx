import { Description } from '@wpsocio/components';
import { FormField } from '@wpsocio/form';
import { __ } from '@wpsocio/i18n';
import { getFieldLabel } from '../../services';
import { AjaxWidgetInfo } from './AjaxWidgetInfo';

const prefix = 'ajax_widget';

export const AjaxWidget: React.FC = () => {
	return (
		<>
			<Description>
				{__(
					'Ajax widget is a beautiful scrollable widget which only supports channels.',
				)}
			</Description>
			<FormField
				addonBefore="@"
				description={__('Channel username.')}
				after={__(
					'This is the default username, you can override it in widgets and shortcodes.',
				)}
				fieldType="text"
				label={getFieldLabel('username')}
				maxW="200px"
				name={`${prefix}.username`}
				placeholder="WPTelegram"
			/>
			<FormField
				fieldType="text"
				label={getFieldLabel('width')}
				maxW="130px"
				name={`${prefix}.width`}
				placeholder={`300 ${__('or')} 100%`}
			/>
			<FormField
				fieldType="text"
				label={getFieldLabel('height')}
				maxW="100px"
				name={`${prefix}.height`}
				placeholder={'600'}
			/>
			<AjaxWidgetInfo />
		</>
	);
};
