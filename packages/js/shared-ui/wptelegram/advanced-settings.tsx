import { useWatch } from '@wpsocio/form';
import { __ } from '@wpsocio/i18n';
import { FormControl } from '@wpsocio/ui-components/ui/form.jsx';
import { Separator } from '@wpsocio/ui-components/ui/separator.jsx';
import { Link } from '@wpsocio/ui-components/wrappers/link.jsx';
import { RadioGroup } from '@wpsocio/ui-components/wrappers/radio-group.js';
import { Switch } from '@wpsocio/ui-components/wrappers/switch.jsx';
import type { OptionProps } from '@wpsocio/ui-components/wrappers/types.js';
import { prefixName } from '@wpsocio/utilities/misc.js';
import { useMemo } from 'react';
import { Code } from '../components/code.jsx';
import { FormField } from '../form/form-field.js';
import { FormItem } from '../form/form-item.js';
import { MultiCheckboxField } from '../form/multi-checkbox-field.jsx';
import { getFieldLabel } from './fields.js';
import { SingleMessage } from './single-message.js';
import type { CommonProps } from './types.js';

export interface AdvancedSettingsProps extends CommonProps {
	log_options: Array<OptionProps & { viewLink: string }>;
	debug_info: string;
}

export const AdvancedSettings: React.FC<AdvancedSettingsProps> = ({
	debug_info,
	log_options,
	prefix,
}) => {
	const logOptions = useMemo(() => {
		return log_options.map(({ viewLink, ...rest }) => ({
			...rest,
			description: (
				<span>
					[
					<Link href={viewLink} isExternal>
						{__('View log')}
					</Link>
					]
				</span>
			),
		}));
	}, [log_options]);

	return (
		<>
			<FormField
				name={prefixName('send_files_by_url', prefix)}
				render={({ field }) => (
					<FormItem
						label={getFieldLabel('send_files_by_url')}
						description={__(
							'Turn off to upload the files/images instead of passing the url.',
						)}
					>
						<FormControl>
							<Switch
								{...field}
								value={field.value?.toString()}
								checked={field.value}
								onCheckedChange={field.onChange}
							/>
						</FormControl>
					</FormItem>
				)}
			/>
			<Separator className="my-6" />
			<MultiCheckboxField
				name={prefixName('enable_logs', prefix)}
				label={getFieldLabel('enable_logs')}
				options={logOptions}
				inlineDescription
			/>
			<Separator className="my-6" />
			<div className="space-y-2 md:flex md:gap-2 md:py-4">
				<span className="font-medium peer-disabled:cursor-not-allowed peer-disabled:opacity-70 text-base md:mt-2 md:basis-[30%]">
					{getFieldLabel('debug_info')}
				</span>
				<div>
					<Code className="p-0">{debug_info}</Code>
				</div>
			</div>
			<Separator className="my-6" />
			<FormField
				name={prefixName('clean_uninstall', prefix)}
				render={({ field }) => (
					<FormItem label={getFieldLabel('clean_uninstall')}>
						<FormControl>
							<Switch
								{...field}
								value={field.value?.toString()}
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