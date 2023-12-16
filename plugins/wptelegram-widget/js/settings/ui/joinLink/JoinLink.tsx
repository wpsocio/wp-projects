import { Description } from '@wpsocio/components';
import { FormField } from '@wpsocio/form';
import { __ } from '@wpsocio/i18n';
import { getFieldLabel, useData } from '../../services';
import { JoinLinkInfo } from './JoinLinkInfo';
import { Styles } from './Styles';

const prefix = 'join_link';

const getPositionOptions = () => [
	{ value: 'before_content', label: __('Before content') },
	{ value: 'after_content', label: __('After content') },
];

export const JoinLink: React.FC = () => {
	const { post_types } = useData('uiData');
	return (
		<>
			<Description>
				{__('Join link can be automatically added to posts.')}
			</Description>
			<FormField
				fieldType="text"
				label={getFieldLabel('url')}
				maxW="450px"
				name={`${prefix}.url`}
				placeholder="https://t.me/WPTelegram"
			/>
			<FormField
				fieldType="text"
				label={getFieldLabel('text')}
				maxW="300px"
				name={`${prefix}.text`}
				placeholder="Join @WPTelegram on Telegram"
			/>
			<Styles />
			<FormField
				fieldType="multicheck"
				label={getFieldLabel('post_types')}
				name={`${prefix}.post_types`}
				options={post_types}
			/>
			<FormField
				fieldType="radio"
				label={getFieldLabel('position')}
				name={`${prefix}.position`}
				options={getPositionOptions()}
			/>
			<FormField
				description={__('Priority with respect to adjacent items.')}
				fieldType="number"
				label={getFieldLabel('priority')}
				max={1000}
				maxW="100px"
				min={1}
				name={`${prefix}.priority`}
				placeholder="10"
			/>
			<FormField
				description={__('Whether to open the join link in new tab.')}
				fieldType="switch"
				label={getFieldLabel('open_in_new_tab')}
				name={`${prefix}.open_in_new_tab`}
			/>
			<JoinLinkInfo />
		</>
	);
};
