import { useFormContext } from '@wpsocio/form';
import { __ } from '@wpsocio/i18n';
import { cn } from '@wpsocio/ui-components';
import { Checkbox } from '@wpsocio/ui-components/wrappers/checkbox.jsx';
import {
	FormControl,
	FormField,
} from '@wpsocio/ui-components/wrappers/form.js';
import type {
	OptionProps,
	OptionsType,
} from '@wpsocio/ui-components/wrappers/types.js';
import { FormItem } from '../form/form-item.js';

export type MultiCheckboxFieldProps = {
	name: string;
	label: React.ReactNode;
	options: Array<OptionProps & { description?: React.ReactNode }>;
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
	const { control } = useFormContext();

	return (
		<FormField
			control={control}
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
								control={control}
								name={name}
								key={item.value}
								render={({ field }) => (
									<FormItem className="space-y-0 md:py-0">
										<FormControl>
											<Checkbox
												{...field}
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
