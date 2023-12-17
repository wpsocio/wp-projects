import { __ } from '@wpsocio/i18n';
import { FormField } from '@wpsocio/form';
import { Divider } from '@wpsocio/adapters';
import { prefixName } from '@wpsocio/utilities';

import { getFieldLabel } from '../services';
import type { CommonProps } from './types';

export const P2TGSwitchAndPluginPosts: React.FC<CommonProps> = ({ prefix }) => {
	return (
		<>
			<FormField
				description={__('Show an ON/OFF switch on the post edit screen.')}
				after={__(
					'You can use this switch to override the settings for a particular post.',
				)}
				fieldType="switch"
				label={getFieldLabel('post_edit_switch')}
				name={prefixName('post_edit_switch', prefix)}
			/>
			<Divider />
			<FormField
				description={__(
					'Enable this option if you use a plugin to generate posts.',
				)}
				fieldType="switch"
				label={getFieldLabel('plugin_posts')}
				name={prefixName('plugin_posts', prefix)}
			/>
		</>
	);
};
