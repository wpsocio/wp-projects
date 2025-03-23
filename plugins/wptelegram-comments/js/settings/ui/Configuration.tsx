import { useFormContext } from '@wpsocio/form';
import { __ } from '@wpsocio/i18n';
import { SectionCard } from '@wpsocio/shared-ui/components/section-card.js';
import { FormItem } from '@wpsocio/shared-ui/form/form-item';
import { MultiCheckboxField } from '@wpsocio/shared-ui/form/multi-checkbox-field.js';
import { Textarea } from '@wpsocio/ui/components/textarea';
import { FormControl, FormField } from '@wpsocio/ui/wrappers/form';
import { type DataShape, getDomData, getFieldLabel } from '../services';
import { Code } from './Code';

const { post_types } = getDomData('uiData');

export const Configuration = () => {
	const { control } = useFormContext<DataShape>();

	return (
		<SectionCard title={__('Configuration')}>
			<div className="flex flex-col gap-10 md:gap-4">
				<Code />

				<MultiCheckboxField
					name="post_types"
					description={__(
						'The comments widget will be shown on the selected post types.',
					)}
					label={getFieldLabel('post_types')}
					options={post_types}
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
