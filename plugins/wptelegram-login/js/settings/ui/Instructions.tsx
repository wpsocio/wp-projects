import { __, sprintf } from '@wpsocio/i18n';
import { Code } from '@wpsocio/shared-ui/components/code';
import { Instructions as InstructionsUI } from '@wpsocio/shared-ui/components/instructions';
import { Alert } from '@wpsocio/ui/wrappers/alert';
import { Link } from '@wpsocio/ui/wrappers/link';
import { createInterpolateElement } from '@wpsocio/utilities/createInterpolateElement.js';
import { getDomData } from '../services';

const { location } = window;

const { wptelegram_active } = getDomData('uiData');

export const Instructions: React.FC = () => {
	return (
		<InstructionsUI>
			{wptelegram_active && (
				<Alert className="font-medium my-4 max-w-max" title={__('Note:')}>
					<span className="text-red-600">
						{__('You can use the same bot for all the WP Telegram plugins.')}
					</span>
				</Alert>
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
