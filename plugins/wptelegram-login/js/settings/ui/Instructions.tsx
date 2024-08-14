import { __, sprintf } from '@wpsocio/i18n';
import { Code } from '@wpsocio/shared-ui/components/code';
import { Instructions as InstructionsUI } from '@wpsocio/shared-ui/components/instructions';
import { Link } from '@wpsocio/ui-components/wrappers/link.js';

import { createInterpolateElement } from '@wpsocio/utilities';
import { useData } from '../services';

const { location } = window;

export const Instructions: React.FC = () => {
	const { wptelegram_active } = useData('uiData');
	return (
		<InstructionsUI>
			{wptelegram_active && (
				<p className="text-red-600 font-medium my-4">
					{__('Note:')}
					&nbsp;
					{__('You can use the same bot for all the WP Telegram plugins.')}
				</p>
			)}
			<ol className="ms-8 list-decimal">
				<li>
					{createInterpolateElement(
						sprintf(
							/* translators: 1 command name, 2 bot name */
							__('Create a Bot by sending %1$s command to %2$s.'),
							'<Command />',
							'<Link />',
						),
						{
							Command: (
								<b>
									<Code>/newbot</Code>
								</b>
							),
							Link: (
								<Link href="https://t.me/BotFather" isExternal>
									@BotFather
								</Link>
							),
						},
					)}
				</li>
				<li>
					{sprintf(
						/* translators: %s bot name */
						__('After completing the steps %s will provide you the Bot Token.'),
						'@BotFather',
					)}
				</li>
				<li>
					{createInterpolateElement(
						`${__(
							'Copy the token and paste into the Bot Token field below.',
						)} ${sprintf(
							/* translators: %s application name */
							__('For ease, use %s'),
							'<Link />',
						)}`,
						{
							Link: (
								<Link href="https://desktop.telegram.org" isExternal>
									{__('Telegram Desktop')}
								</Link>
							),
						},
					)}
				</li>
				<li>
					{createInterpolateElement(
						sprintf(
							/* translators: 1 command name, 2 bot name, 3 site url */
							__(
								'Send %1$s command to %2$s, select your bot and then send %3$s',
							),
							'<Command />',
							'<Link />',
							'<Host />',
						),
						{
							Command: (
								<b>
									<Code>/setdomain</Code>
								</b>
							),
							Link: (
								<Link href="https://t.me/BotFather" isExternal>
									@BotFather
								</Link>
							),
							Host: (
								<b>
									<Code>{location.host}</Code>
								</b>
							),
						},
					)}
				</li>
				<li>
					{__(
						'Test your bot token below and fill in the bot username if not filled automatically.',
					)}
				</li>
				<li>{sprintf(__('Hit %s below'), __('Save Changes'))}</li>
				<li>{__("That's it. You are ready to rock :)")}</li>
			</ol>
		</InstructionsUI>
	);
};
