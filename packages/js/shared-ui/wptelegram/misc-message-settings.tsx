import { __ } from '@wpsocio/i18n';
import { FormControl } from '@wpsocio/ui/components/form';
import { Link } from '@wpsocio/ui/wrappers/link';
import { Switch } from '@wpsocio/ui/wrappers/switch';
import type { OptionsType } from '@wpsocio/ui/wrappers/types';
import { prefixName } from '@wpsocio/utilities/misc.js';
import { FormField } from '../form/form-field.js';
import { FormItem } from '../form/form-item.js';
import { getFieldLabel } from './fields.js';
import { ParseModeField } from './parse-mode-field.js';
import type { CommonProps } from './types.js';

export type MiscMessageSettingsProps = CommonProps & {
	parseModeDocsLink?: string;
	parseModeOptions?: OptionsType;
};

export const MiscMessageSettings: React.FC<MiscMessageSettingsProps> = ({
	prefix,
	parseModeDocsLink,
	parseModeOptions,
}) => {
	return (
		<div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6 md:gap-2 my-6">
			<div>
				<FormField
					name={prefixName('cats_as_tags', prefix)}
					render={({ field }) => (
						<FormItem
							className="md:flex-col"
							label={getFieldLabel('cats_as_tags')}
							description={__('Send categories as hashtags.')}
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
			</div>
			<div>
				<ParseModeField
					prefix={prefix}
					docsLink={parseModeDocsLink}
					options={parseModeOptions}
				/>
			</div>
			<div>
				<FormField
					name={prefixName('protect_content', prefix)}
					render={({ field }) => (
						<FormItem
							className="md:flex-col"
							description={
								<>
									{__(
										'Protects the contents of sent messages from forwarding and saving.',
									)}
									<br />
									<Link
										href="https://telegram.org/blog/protected-content-delete-by-date-and-more#protected-content-in-groups-and-channels"
										isExternal
									>
										{__('Learn more')}
									</Link>
								</>
							}
							label={getFieldLabel('protect_content')}
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
			</div>
		</div>
	);
};
