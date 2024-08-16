import { useFormContext } from '@wpsocio/form';
import { __ } from '@wpsocio/i18n';
import { SectionCard } from '@wpsocio/shared-ui/components/section-card.js';
import { FormItem } from '@wpsocio/shared-ui/form/form-item';
import { Textarea } from '@wpsocio/ui-components/ui/textarea';
import { Checkbox } from '@wpsocio/ui-components/wrappers/checkbox.js';
import {
	FormControl,
	FormField,
} from '@wpsocio/ui-components/wrappers/form.js';
import { type DataShape, getFieldLabel, useData } from '../services';
import { Code } from './Code';

export const Configuration = () => {
	const { post_types } = useData('uiData');
	const { control } = useFormContext<DataShape>();

	return (
		<SectionCard title={__('Configuration')}>
			<div className="flex flex-col gap-10 md:gap-4">
				<Code />

				<FormField
					control={control}
					name="post_types"
					render={({ field }) => (
						<FormItem
							label={getFieldLabel('post_types')}
							description={__(
								'The comments widget will be shown on the selected post types.',
							)}
						>
							<div className="grid gap-2">
								{post_types.map((item, index) => (
									<FormField
										control={control}
										name="post_types"
										key={item.value}
										render={({ field }) => (
											<FormItem className="space-y-0 md:py-0">
												<FormControl>
													<Checkbox
														{...field}
														name={`post_types[${index}]`}
														checked={field.value?.includes(item.value)}
														wrapperClassName=""
														onCheckedChange={(checked) => {
															return checked
																? field.onChange([
																		...(field.value || []),
																		item.value,
																	])
																: field.onChange(
																		field.value?.filter(
																			(value) => value !== item.value,
																		),
																	);
														}}
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

				<FormField
					control={control}
					name="exclude"
					render={({ field }) => (
						<FormItem
							label={getFieldLabel('exclude')}
							description={__(
								'To exclude the specific posts, enter the post or page IDs separated by comma.',
							)}
						>
							<FormControl>
								<Textarea
									cols={60}
									rows={4}
									spellCheck={false}
									placeholder="53,281"
									{...field}
								/>
							</FormControl>
						</FormItem>
					)}
				/>
			</div>
		</SectionCard>
	);
};
