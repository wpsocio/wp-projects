import { __ } from '@wpsocio/i18n';
import { FormControl } from '@wpsocio/ui-components/ui/form.js';
import { Separator } from '@wpsocio/ui-components/ui/separator.js';
import { Switch } from '@wpsocio/ui-components/wrappers/switch.js';
import { prefixName } from '@wpsocio/utilities/misc.js';
import { FormField } from '../form/form-field.js';
import { FormItem } from '../form/form-item.js';
import { getFieldLabel } from './fields.js';
import type { CommonProps } from './types.js';

export const P2TGSwitchAndPluginPosts: React.FC<CommonProps> = ({ prefix }) => {
	return (
		<>
			<FormField
				name={prefixName('post_edit_switch', prefix)}
				render={({ field }) => (
					<FormItem
						label={getFieldLabel('post_edit_switch')}
						description={__('Show an ON/OFF switch on the post edit screen.')}
						afterMessage={__(
							'You can use this switch to override the settings for a particular post.',
						)}
					>
						<FormControl>
							<Switch
								{...field}
								value={undefined}
								checked={field.value}
								onCheckedChange={field.onChange}
							/>
						</FormControl>
					</FormItem>
				)}
			/>
			<Separator className="my-8 md:my-4" />
			<FormField
				name={prefixName('plugin_posts', prefix)}
				render={({ field }) => (
					<FormItem
						description={__(
							'Enable this option if you use a plugin to generate posts.',
						)}
						label={getFieldLabel('plugin_posts')}
					>
						<FormControl>
							<Switch
								{...field}
								value={undefined}
								checked={field.value}
								onCheckedChange={field.onChange}
							/>
						</FormControl>
					</FormItem>
				)}
			/>
		</>
	);
};
