import { Link } from '@wpsocio/adapters';
import {
	Code,
	Smile,
	WidgetInfoCard as WidgetInfoCardUI,
	WidgetInfoItem,
} from '@wpsocio/components';
import { __, sprintf } from '@wpsocio/i18n';
import { createInterpolateElement } from '@wpsocio/utilities';

import { useData } from '../services';

export const WidgetInfoCard = () => {
	const { admin_url } = useData('api');

	return (
		<WidgetInfoCardUI>
			<WidgetInfoItem textAlign="start">
				{createInterpolateElement(
					sprintf(
						/* translators: 1, 2 Menu names */
						__(
							'Goto %1$s and click/drag %2$s and place it where you want it to be.',
						),
						'<Path />',
						'<Widget />',
					),
					{
						Path: (
							<>
								<b>{__('Appearance')}</b> &gt;{' '}
								<Link href={`${admin_url}/widgets.php`}>{__('Widgets')}</Link>
							</>
						),
						Widget: <b>{__('WP Telegram Login')}</b>,
					},
				)}
			</WidgetInfoItem>
			<WidgetInfoItem textAlign="start">
				{__(
					'Alternately, you can use the below shortcode or the block available in block editor.',
				)}
			</WidgetInfoItem>
			<WidgetInfoItem>{__('Inside page or post content:')}</WidgetInfoItem>
			<WidgetInfoItem>
				<Code width="100%">
					{
						'[wptelegram-login button_style="large" show_user_photo="1" corner_radius="15" lang="en"]'
					}
				</Code>
			</WidgetInfoItem>
			<WidgetInfoItem>{__('Inside the theme templates')}</WidgetInfoItem>
			<WidgetInfoItem>
				<Code width="100%">
					{
						"<?php\nif ( function_exists( 'wptelegram_login' ) ) {\n    wptelegram_login();\n}\n?>"
					}
				</Code>
				<br />
				<span>{__('or')}</span>
				<br />
				<Code width="100%">
					{'<?php\n' +
						'$shortcode = \'[wptelegram-login button_style="small" show_user_photo="0" show_if_user_is="logged_in"]\';\n' +
						'echo do_shortCode( $shortcode );\n' +
						'?>'}
				</Code>
			</WidgetInfoItem>
			<WidgetInfoItem>
				<Smile />
			</WidgetInfoItem>
		</WidgetInfoCardUI>
	);
};
