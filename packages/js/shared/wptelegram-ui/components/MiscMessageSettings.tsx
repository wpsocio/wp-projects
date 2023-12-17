import { __ } from '@wpsocio/i18n';
import { FormField } from '@wpsocio/form';
import { FeildStack, FeildStackItem } from '@wpsocio/components';
import { prefixName } from '@wpsocio/utilities';

import { getFieldLabel } from '../services';
import type { CommonProps } from './types';
import { ParseModeField } from './ParseModeField';

export const MiscMessageSettings: React.FC<CommonProps> = ({ prefix }) => {
	return (
		<FeildStack>
			<FeildStackItem>
				<FormField
					name={prefixName('cats_as_tags', prefix)}
					fieldType="switch"
					label={getFieldLabel('cats_as_tags')}
					description={__('Send categories as hashtags.')}
					controlClassName="no-flex"
				/>
			</FeildStackItem>
			<FeildStackItem>
				<ParseModeField prefix={prefix} controlClassName="no-flex" />
			</FeildStackItem>
			<FeildStackItem>
				<FormField
					name={prefixName('disable_web_page_preview', prefix)}
					fieldType="switch"
					label={getFieldLabel('disable_web_page_preview')}
					description={__('Disables previews for links in the messages.')}
					controlClassName="no-flex"
				/>
			</FeildStackItem>
		</FeildStack>
	);
};
