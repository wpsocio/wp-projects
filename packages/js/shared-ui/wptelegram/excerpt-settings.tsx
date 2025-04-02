import { useWatch } from '@wpsocio/form';
import { __ } from '@wpsocio/i18n';
import { FormControl } from '@wpsocio/ui/components/form';
import { Input } from '@wpsocio/ui/wrappers/input';
import { Select } from '@wpsocio/ui/wrappers/select';
import { Switch } from '@wpsocio/ui/wrappers/switch';
import { prefixName } from '@wpsocio/utilities/misc.js';
import { FormField } from '../form/form-field.js';
import { FormItem } from '../form/form-item.js';
import { getFieldLabel } from './fields.js';
import type { CommonProps } from './types.js';

const getExcerptSourceOptions = () => [
	{
		value: 'post_content',
		label: __('Post Content'),
	},
	{
		value: 'before_more',
		label: __('Before "Read More"'),
	},
	{
		value: 'post_excerpt',
		label: __('Post Excerpt'),
	},
];

export const ExcerptSettings: React.FC<CommonProps> = ({ prefix }) => {
	const template: string =
		useWatch({ name: prefixName('message_template', prefix) }) || '';
	const hasExcerpt = template.includes('{post_excerpt}');

	return (
		<div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6 my-6">
			<div>
				<FormField
					name={prefixName('excerpt_source', prefix)}
					render={({ field }) => (
						<FormItem
							label={getFieldLabel('excerpt_source')}
							className="md:flex-col"
							isDisabled={!hasExcerpt}
						>
							<FormControl>
								<Select
									{...field}
									onValueChange={field.onChange}
									disabled={!hasExcerpt}
									defaultValue={field.value}
									options={getExcerptSourceOptions()}
								/>
							</FormControl>
						</FormItem>
					)}
				/>
			</div>
			<div>
				<FormField
					name={prefixName('excerpt_length', prefix)}
					render={({ field }) => (
						<FormItem
							label={getFieldLabel('excerpt_length')}
							description={__('Number of words for the excerpt.')}
							className="md:flex-col"
							isDisabled={!hasExcerpt}
						>
							<FormControl className="max-w-[100px]">
								<Input
									type="number"
									max={300}
									min={1}
									disabled={!hasExcerpt}
									{...field}
								/>
							</FormControl>
						</FormItem>
					)}
				/>
			</div>
			<div>
				<FormField
					name={prefixName('excerpt_preserve_eol', prefix)}
					render={({ field }) => (
						<FormItem
							label={getFieldLabel('excerpt_preserve_eol')}
							description={__('Preserve newlines in Post Excerpt.')}
							className="md:flex-col"
							isDisabled={!hasExcerpt}
						>
							<FormControl>
								<Switch
									{...field}
									value={undefined}
									checked={field.value}
									onCheckedChange={field.onChange}
									disabled={!hasExcerpt}
									aria-readonly={!hasExcerpt}
								/>
							</FormControl>
						</FormItem>
					)}
				/>
			</div>
		</div>
	);
};
