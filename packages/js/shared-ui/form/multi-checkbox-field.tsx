import { cn } from '@wpsocio/ui-components';
import { Checkbox } from '@wpsocio/ui-components/wrappers/checkbox.js';
import { FormControl } from '@wpsocio/ui-components/wrappers/form.js';
import type { OptionProps } from '@wpsocio/ui-components/wrappers/types.js';
import { FormItem } from '../form/form-item.js';
import { FormField } from './form-field.js';

export type MultiCheckboxFieldProps = {
	name: string;
	label: React.ReactNode;
	options: Array<
		OptionProps & { description?: React.ReactNode; disabled?: boolean }
	>;
	description?: string;
	wrapperClassName?: string;
	inlineDescription?: boolean;
};

export function MultiCheckboxField({
	name,
	label,
	description,
	options,
	wrapperClassName,
	inlineDescription = false,
}: MultiCheckboxFieldProps) {
	return (
		<FormField
			name={name}
			render={() => (
				<FormItem
					label={label}
					description={description}
					className={wrapperClassName}
				>
					<div className="grid gap-2">
						{options.map((item, index) => (
							<FormField
								name={name}
								key={item.value}
								render={({ field }) => (
									<FormItem className="space-y-0 md:py-0">
										<FormControl>
											<Checkbox
												{...field}
												disabled={item.disabled}
												name={`${name}[${index}]`}
												checked={field.value?.includes(item.value)}
												labelWrapperClassName={cn({
													'grid-cols-2': inlineDescription,
												})}
												onCheckedChange={(checked) => {
													return checked
														? field.onChange([
																...(field.value || []),
																item.value,
															])
														: field.onChange(
																field.value?.filter(
																	(value: string) => value !== item.value,
																),
															);
												}}
												description={item.description}
											>
												{item.label}
											</Checkbox>
										</FormControl>
									</FormItem>
								)}
							/>
						))}
					</div>
				</FormItem>
			)}
		/>
	);
}
