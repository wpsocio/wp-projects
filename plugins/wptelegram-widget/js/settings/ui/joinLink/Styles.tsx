import { useFormContext, useWatch } from '@wpsocio/form';
import { TelegramIcon } from '@wpsocio/icons';
import { FormItem } from '@wpsocio/shared-ui/form/form-item';
import { ColorInputPicker } from '@wpsocio/ui-components/wrappers/color-input-picker.js';
import {
	FormControl,
	FormField,
} from '@wpsocio/ui-components/wrappers/form.js';
import { Link } from '@wpsocio/ui-components/wrappers/link';
import { useEffect } from 'react';
import { ROOT_ID } from '../../constants';
import { type DataShape, getFieldLabel } from '../../services';

const prefix = 'join_link';

export const Styles: React.FC = () => {
	const [text, url, bgcolor, text_color] = useWatch({
		name: [
			`${prefix}.text`,
			`${prefix}.url`,
			`${prefix}.bgcolor`,
			`${prefix}.text_color`,
		],
	});

	useEffect(() => {
		const root = document.getElementById(ROOT_ID);

		root?.style.setProperty('--wptelegram-widget-join-link-bg-color', bgcolor);
		root?.style.setProperty('--wptelegram-widget-join-link-color', text_color);
	}, [bgcolor, text_color]);

	const { control } = useFormContext<DataShape>();

	return (
		<>
			<FormField
				control={control}
				name={`${prefix}.bgcolor`}
				render={({ field }) => (
					<FormItem label={getFieldLabel('bgcolor')}>
						<FormControl>
							<ColorInputPicker {...field} />
						</FormControl>
					</FormItem>
				)}
			/>
			<FormField
				control={control}
				name={`${prefix}.text_color`}
				render={({ field }) => (
					<FormItem label={getFieldLabel('text_color')}>
						<FormControl>
							<ColorInputPicker {...field} />
						</FormControl>
					</FormItem>
				)}
			/>
			{text && url && (
				<div className="wp-block-wptelegram-widget-join-channel aligncenter">
					<Link
						href={url}
						rel="noopener noreferrer"
						className="components-button join-link is-large has-text has-icon"
						style={{
							backgroundColor: bgcolor,
							color: text_color,
						}}
					>
						<TelegramIcon />
						{text}
					</Link>
				</div>
			)}
		</>
	);
};
