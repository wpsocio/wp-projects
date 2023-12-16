import { Link } from '@wpsocio/adapters';
import { FormField, useWatch } from '@wpsocio/form';
import { TelegramIcon } from '@wpsocio/icons';
import { useEffect } from 'react';

import { getFieldLabel } from '../../services';

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
		document.documentElement.style.setProperty(
			'--wptelegram-widget-join-link-bg-color',
			bgcolor,
		);
		document.documentElement.style.setProperty(
			'--wptelegram-widget-join-link-color',
			text_color,
		);
	}, [bgcolor, text_color]);

	return (
		<>
			<FormField
				fieldType="colorpicker"
				label={getFieldLabel('bgcolor')}
				name={`${prefix}.bgcolor`}
			/>
			<FormField
				fieldType="colorpicker"
				label={getFieldLabel('text_color')}
				name={`${prefix}.text_color`}
			/>
			{text && url && (
				<div className="wp-block-wptelegram-widget-join-channel aligncenter">
					<Link
						backgroundColor={bgcolor}
						color={text_color}
						href={url}
						rel="noopener noreferrer"
						className="components-button join-link is-large has-text has-icon"
					>
						<TelegramIcon />
						{text}
					</Link>
				</div>
			)}
		</>
	);
};
