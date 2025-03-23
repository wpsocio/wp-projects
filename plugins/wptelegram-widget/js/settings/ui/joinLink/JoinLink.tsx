import { useFormContext } from '@wpsocio/form';
import { __ } from '@wpsocio/i18n';
import { FormItem } from '@wpsocio/shared-ui/form/form-item';
import { FormControl, FormField } from '@wpsocio/ui/wrappers/form';
import { Input } from '@wpsocio/ui/wrappers/input';
import { RadioGroup } from '@wpsocio/ui/wrappers/radio-group';
import { Switch } from '@wpsocio/ui/wrappers/switch';
import { type DataShape, getFieldLabel } from '../../services';
import { JoinLinkInfo } from './JoinLinkInfo';
import { PostTypes } from './PostTypes';
import { Styles } from './Styles';

const prefix = 'join_link';

const getPositionOptions = () => [
	{ value: 'before_content', label: __('Before content') },
	{ value: 'after_content', label: __('After content') },
];

export const JoinLink: React.FC = () => {
	const { control } = useFormContext<DataShape>();

	return (
		<>
			<div className="flex flex-col gap-10 md:gap-4 mb-8">
				<FormField
					control={control}
					name={`${prefix}.url`}
					render={({ field }) => (
						<FormItem label={getFieldLabel('url')}>
							<FormControl>
								<Input
									placeholder="https://t.me/WPTelegram"
									{...field}
									type="url"
								/>
							</FormControl>
						</FormItem>
					)}
				/>
				<FormField
					control={control}
					name={`${prefix}.text`}
					render={({ field }) => (
						<FormItem label={getFieldLabel('text')}>
							<FormControl>
								<Input placeholder="Join @WPTelegram on Telegram" {...field} />
							</FormControl>
						</FormItem>
					)}
				/>
				<Styles />

				<PostTypes />

				<FormField
					control={control}
					name={`${prefix}.position`}
					render={({ field }) => (
						<FormItem label={getFieldLabel('position')}>
							<FormControl>
								<RadioGroup
									{...field}
									onValueChange={field.onChange}
									defaultValue={field.value}
									options={getPositionOptions()}
									displayInline
								/>
							</FormControl>
						</FormItem>
					)}
				/>

				<FormField
					control={control}
					name={`${prefix}.priority`}
					render={({ field }) => (
						<FormItem
							label={getFieldLabel('priority')}
							description={__('Priority with respect to adjacent items.')}
						>
							<FormControl className="max-w-[100px]">
								<Input
									type="number"
									max={1000}
									min={1}
									placeholder="10"
									{...field}
								/>
							</FormControl>
						</FormItem>
					)}
				/>

				<FormField
					control={control}
					name={`${prefix}.open_in_new_tab`}
					render={({ field }) => (
						<FormItem
							label={getFieldLabel('open_in_new_tab')}
							description={__('Whether to open the join link in new tab.')}
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
			<JoinLinkInfo />
		</>
	);
};
