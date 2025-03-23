import { useFormContext } from '@wpsocio/form';
import { __ } from '@wpsocio/i18n';
import { FormItem } from '@wpsocio/shared-ui/form/form-item';
import { Checkbox } from '@wpsocio/ui/wrappers/checkbox';
import {
	FormControl,
	FormField,
} from '@wpsocio/ui/wrappers/form';
import { type DataShape, getDomData, getFieldLabel } from '../../services';

const { post_types } = getDomData('uiData');

export function PostTypes() {
	const { control } = useFormContext<DataShape>();

	return (
		<FormField
			control={control}
			name="join_link.post_types"
			render={() => (
				<FormItem
					label={getFieldLabel('post_types')}
					description={__(
						'The join link will be automatically added to the selected post types.',
					)}
				>
					<div className="grid gap-2">
						{post_types.map((item, index) => (
							<FormField
								control={control}
								name="join_link.post_types"
								key={item.value}
								render={({ field }) => (
									<FormItem className="space-y-0 md:py-0">
										<FormControl>
											<Checkbox
												{...field}
												name={`join_link.post_types[${index}]`}
												checked={field.value?.includes(
													item.value?.toString() || '',
												)}
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
	);
}
