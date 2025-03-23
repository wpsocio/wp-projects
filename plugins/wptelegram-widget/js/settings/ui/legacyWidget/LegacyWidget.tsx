import { useFormContext } from '@wpsocio/form';
import { __ } from '@wpsocio/i18n';
import { FormItem } from '@wpsocio/shared-ui/form/form-item';
import {
	FormControl,
	FormField,
} from '@wpsocio/ui/wrappers/form';
import { Input } from '@wpsocio/ui/wrappers/input';
import { RadioGroup } from '@wpsocio/ui/wrappers/radio-group';
import { type DataShape, getFieldLabel } from '../../services';
import { BotToken } from './BotToken';
import { Instructions } from './Instructions';
import { LegacyWidgetInfo } from './LegacyWidgetInfo';
import { OldMessagesInfo } from './OldMessagesInfo';
import { Username } from './Username';
import { PREFIX } from './constants';

const getAuthorPhotoOptions = () => [
	{ value: 'auto', label: __('Auto') },
	{ value: 'always_show', label: __('Always show') },
	{ value: 'always_hide', label: __('Always hide') },
];

export const LegacyWidget: React.FC = () => {
	const { control } = useFormContext<DataShape>();

	return (
		<>
			<Instructions />
			<div className="flex flex-col gap-10 md:gap-4 mb-8">
				<Username />
				<OldMessagesInfo />
				<BotToken />
				<FormField
					control={control}
					name={`${PREFIX}.width`}
					render={({ field }) => (
						<FormItem label={getFieldLabel('width')}>
							<FormControl className="max-w-[130px]">
								<Input placeholder={`300 ${__('or')} 100%`} {...field} />
							</FormControl>
						</FormItem>
					)}
				/>

				<FormField
					control={control}
					name={`${PREFIX}.author_photo`}
					render={({ field }) => (
						<FormItem label={getFieldLabel('author_photo')}>
							<FormControl>
								<RadioGroup
									{...field}
									onValueChange={field.onChange}
									defaultValue={field.value}
									options={getAuthorPhotoOptions()}
									displayInline
								/>
							</FormControl>
						</FormItem>
					)}
				/>

				<FormField
					control={control}
					name={`${PREFIX}.num_messages`}
					render={({ field }) => (
						<FormItem
							label={getFieldLabel('num_messages')}
							description={__('Number of messages to display in the widget.')}
						>
							<FormControl className="max-w-[100px]">
								<Input
									type="number"
									max={50}
									min={1}
									placeholder="5"
									{...field}
								/>
							</FormControl>
						</FormItem>
					)}
				/>
			</div>
			<LegacyWidgetInfo />
		</>
	);
};
