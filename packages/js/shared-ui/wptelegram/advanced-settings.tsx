import { __ } from '@wpsocio/i18n';
import { FormControl } from '@wpsocio/ui/components/form';
import { Separator } from '@wpsocio/ui/components/separator';
import { Link } from '@wpsocio/ui/wrappers/link';
import { Switch } from '@wpsocio/ui/wrappers/switch';
import type { OptionProps } from '@wpsocio/ui/wrappers/types';
import { prefixName } from '@wpsocio/utilities/misc.js';
import { useMemo } from 'react';
import { Code } from '../components/code.js';
import { FormField } from '../form/form-field.js';
import { FormItem } from '../form/form-item.js';
import { MultiCheckboxField } from '../form/multi-checkbox-field.js';
import { getFieldLabel } from './fields.js';
import type { CommonProps } from './types.js';

export interface AdvancedSettingsProps extends CommonProps {
	log_options: Array<OptionProps & { viewLink: string }>;
	debug_info?: Record<string, string>;
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
								value={undefined}
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
			{debug_info ? (
				<div className="space-y-2 flex flex-col md:flex-row gap-2 md:py-4">
					<span className="font-medium peer-disabled:cursor-not-allowed peer-disabled:opacity-70 text-base mb-0 mt-0 md:basis-[30%]">
						{getFieldLabel('debug_info')}
					</span>
					<div>
						<table className="border-separate border-spacing-y-2">
							<tbody>
								{Object.entries(debug_info).map(([key, value]) => (
									<tr key={key}>
										<td>
											<Code className="p-0">{key}:</Code>
										</td>
										<td>
											<Code className="ms-2">{value}</Code>
										</td>
									</tr>
								))}
							</tbody>
						</table>
					</div>
				</div>
			) : null}
			<Separator className="my-6" />
			<FormField
				name={prefixName('clean_uninstall', prefix)}
				render={({ field }) => (
					<FormItem label={getFieldLabel('clean_uninstall')}>
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
