import { __, sprintf } from '@wpsocio/i18n';
import { Code } from '@wpsocio/shared-ui/components/code';
import { Instructions as InstructionsUI } from '@wpsocio/shared-ui/components/instructions';
import { Link } from '@wpsocio/ui-components/wrappers/link.js';
import { createInterpolateElement } from '@wpsocio/utilities/createInterpolateElement.js';
import { getDomData } from '../../services';

const { pullUpdatesUrl } = getDomData('assets');

export const Instructions: React.FC = () => {
	return (
		<div>
			<InstructionsUI className="mt-6">
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
							__(
								'After completing the steps %s will provide you the Bot Token.',
							),
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
					<li>{__('Add the Bot as Administrator to your Channel/Group.')}</li>
					<li>{__('Send a test message to see if we did it right.')}</li>
					<li>
						<span className="text-destructive font-medium">
							{__('For groups, disable group privacy for the bot.')}
						</span>
						<ul className="list-disc ms-6">
							<li>
								{createInterpolateElement(
									sprintf(
										/* translators: 1 command name, 2 bot name, 3 site url */
										__('Send %1$s command to %2$s.'),
										'<Command />',
										'<Link />',
									),
									{
										Command: (
											<b>
												<Code>/setprivacy</Code>
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
							<li>{__('Choose your bot.')}</li>
							<li>{__('Select "Disable".')}</li>
						</ul>
					</li>
				</ol>
			</InstructionsUI>
			<p className="text-[#396609]">
				<b>
					{__('Tip!')}
					{'💡'}
				</b>
				&nbsp;
				<span>
					{__(
						'Updates are pulled every five minutes if someone visits your website.',
					)}
				</span>
				&nbsp;
				<span>
					{__(
						'To make sure the updates are pulled in time, it is recommended to set up a cron on your hosting server that hits the below URL every five minutes or so.',
					)}
				</span>
				<br />
				<Code>{pullUpdatesUrl}</Code>
			</p>
		</div>
	);
};
