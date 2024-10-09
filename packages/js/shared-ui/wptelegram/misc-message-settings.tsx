import { __ } from '@wpsocio/i18n';
import { FormControl } from '@wpsocio/ui-components/ui/form.jsx';
import { Link } from '@wpsocio/ui-components/wrappers/link.jsx';
import { Switch } from '@wpsocio/ui-components/wrappers/switch.jsx';
import { prefixName } from '@wpsocio/utilities/misc.js';
import { FormField } from '../form/form-field.js';
import { FormItem } from '../form/form-item.js';
import { getFieldLabel } from './fields.js';
import { ParseModeField } from './parse-mode-field.js';
import type { CommonProps } from './types.js';

export const MiscMessageSettings: React.FC<CommonProps> = ({ prefix }) => {
	return (
		<div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6 md:gap-2 my-6">
			<div>
				<FormField
					name={prefixName('cats_as_tags', prefix)}
					render={({ field }) => (
						<FormItem
							className="flex-col"
							label={getFieldLabel('cats_as_tags')}
							description={__('Send categories as hashtags.')}
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
			</div>
			<div>
				<ParseModeField prefix={prefix} />
			</div>
			<div>
				<FormField
					name={prefixName('protect_content', prefix)}
					render={({ field }) => (
						<FormItem
							className="flex-col"
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
									value={field.value?.toString()}
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
