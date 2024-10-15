import { useFormContext } from '@wpsocio/form';
import { __ } from '@wpsocio/i18n';
import { FormItem } from '@wpsocio/shared-ui/form/form-item';
import {
	FormControl,
	FormField,
} from '@wpsocio/ui-components/wrappers/form.js';
import { Input } from '@wpsocio/ui-components/wrappers/input.js';
import { type DataShape, getFieldLabel } from '../../services';
import { AjaxWidgetInfo } from './AjaxWidgetInfo';

const prefix = 'ajax_widget';

export const AjaxWidget: React.FC = () => {
	const { control } = useFormContext<DataShape>();

	return (
		<>
			<div className="flex flex-col gap-10 md:gap-4 mb-8">
				<FormField
					control={control}
					name={`${prefix}.username`}
					render={({ field }) => (
						<FormItem
							label={getFieldLabel('username')}
							description={__('Channel username.')}
							afterMessage={__(
								'This is the default username, you can override it in widgets and shortcodes.',
							)}
						>
							<FormControl className="max-w-[200px]">
								<Input addonStart="@" placeholder="WPTelegram" {...field} />
							</FormControl>
						</FormItem>
					)}
				/>
				<FormField
					control={control}
					name={`${prefix}.width`}
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
					name={`${prefix}.height`}
					render={({ field }) => (
						<FormItem label={getFieldLabel('height')}>
							<FormControl className="max-w-[130px]">
								<Input placeholder={`300 ${__('or')} 100%`} {...field} />
							</FormControl>
						</FormItem>
					)}
				/>
			</div>
			<AjaxWidgetInfo />
		</>
	);
};
