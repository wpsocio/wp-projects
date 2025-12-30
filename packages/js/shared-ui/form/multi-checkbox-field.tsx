import { cn } from '@wpsocio/ui/lib/utils';
import { Checkbox } from '@wpsocio/ui/wrappers/checkbox';
import {
	FormControl,
	FormDescription,
	FormMessage,
} from '@wpsocio/ui/wrappers/form';
import { Label } from '@wpsocio/ui/wrappers/label';
import type { OptionProps } from '@wpsocio/ui/wrappers/types';
import { useId } from 'react';
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
	isDisabled?: boolean;
};

export function MultiCheckboxField({
	name,
	label,
	description,
	options,
	wrapperClassName,
	inlineDescription = false,
	isDisabled,
}: MultiCheckboxFieldProps) {
	const id = useId();
	return (
		<FormField
			name={name}
			render={() => (
				// biome-ignore lint/a11y/useSemanticElements: role="group" is fine
				<div
					role="group"
					aria-labelledby={`${id}-legend`}
					aria-describedby={`${id}-description`}
					className={cn(
						'space-y-2 flex flex-col md:flex-row gap-2 md:py-4',
						wrapperClassName,
					)}
				>
					<Label asChild>
						<div
							id={`${id}-legend`}
							className={cn('block font-medium md:basis-[30%] mb-0 mt-0', {
								'opacity-50 cursor-not-allowed': isDisabled,
							})}
						>
							{label}
						</div>
					</Label>
					<div className="flex flex-col gap-3 md:flex-1">
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
							{description ? (
								<FormDescription
									id={`${id}-description`}
									className={cn({
										'opacity-50': isDisabled,
									})}
								>
									{description}
								</FormDescription>
							) : null}
							<FormMessage />
						</div>
					</div>
				</div>
			)}
		/>
	);
}
