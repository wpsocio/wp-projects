import { __, sprintf } from '@wpsocio/i18n';
import { Code } from '@wpsocio/shared-ui/components/code.js';
import { PluginInfoItem } from '@wpsocio/shared-ui/components/plugin-info/plugin-info-item.js';
import { Smile } from '@wpsocio/shared-ui/components/smile.js';
import { WidgetInfoCard as WidgetInfoCardUI } from '@wpsocio/shared-ui/components/widget-info/widget-info-card.js';
import { Link } from '@wpsocio/ui-components/wrappers/link.js';
import { createInterpolateElement } from '@wpsocio/utilities/createInterpolateElement';
import { useData } from '../services';

export const WidgetInfoCard = () => {
	const { admin_url } = useData('api');

	return (
		<WidgetInfoCardUI>
			<PluginInfoItem>
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
			</PluginInfoItem>
			<PluginInfoItem>
				{__(
					'Alternately, you can use the below shortcode or the block available in block editor.',
				)}
			</PluginInfoItem>
			<PluginInfoItem>{__('Inside page or post content:')}</PluginInfoItem>
			<PluginInfoItem>
				<Code className="w-full">
					{
						'[wptelegram-login button_style="large" show_user_photo="1" corner_radius="15" lang="en"]'
					}
				</Code>
			</PluginInfoItem>
			<PluginInfoItem>{__('Inside the theme templates')}</PluginInfoItem>
			<PluginInfoItem>
				<Code className="w-full">
					{
						"<?php\nif ( function_exists( 'wptelegram_login' ) ) {\n    wptelegram_login();\n}\n?>"
					}
				</Code>
				<br />
				<span>{__('or')}</span>
				<br />
				<Code className="w-full">
					{'<?php\n' +
						'$shortcode = \'[wptelegram-login button_style="small" show_user_photo="0" show_if_user_is="logged_in"]\';\n' +
						'echo do_shortCode( $shortcode );\n' +
						'?>'}
				</Code>
			</PluginInfoItem>
			<PluginInfoItem className="border-b-0 py-0 text-center">
				<Smile />
			</PluginInfoItem>
		</WidgetInfoCardUI>
	);
};
