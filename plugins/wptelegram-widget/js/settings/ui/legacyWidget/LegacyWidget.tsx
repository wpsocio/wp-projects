import { Description } from '@wpsocio/components';
import { FormField } from '@wpsocio/form';
import { __ } from '@wpsocio/i18n';
import { getFieldLabel } from '../../services';
import { BotToken } from './BotToken';
import { Instructions } from './Instructions';
import { LegacyWidgetInfo } from './LegacyWidgetInfo';
import { Username } from './Username';
import { PREFIX } from './constants';

const getAuthorPhotoOptions = () => [
	{ value: 'auto', label: __('Auto') },
	{ value: 'always_show', label: __('Always show') },
	{ value: 'always_hide', label: __('Always hide') },
];

export const LegacyWidget: React.FC = () => {
	return (
		<>
			<Description>
				{__(
					'Legacy widget is a full height widget which supports both channels and groups.',
				)}
			</Description>
			<Instructions />
			<Username />
			<BotToken />
			<FormField
				fieldType="text"
				label={getFieldLabel('width')}
				maxW="130px"
				name={`${PREFIX}.width`}
				placeholder={`300 ${__('or')} 100%`}
			/>
			<FormField
				fieldType="select"
				label={getFieldLabel('author_photo')}
				name={`${PREFIX}.author_photo`}
				options={getAuthorPhotoOptions()}
			/>
			<FormField
				label={getFieldLabel('num_messages')}
				description={__('Number of messages to display in the widget.')}
				fieldType="number"
				min={1}
				max={50}
				maxWidth="100px"
				name={`${PREFIX}.num_messages`}
				placeholder="5"
			/>
			<LegacyWidgetInfo />
		</>
	);
};
