import { Box, Link, List, ListItem, Text } from '@wpsocio/adapters';
import { Code, Instructions as InstructionsUI } from '@wpsocio/components';
import { __, sprintf } from '@wpsocio/i18n';
import { createInterpolateElement } from '@wpsocio/utilities';

import { useData } from '../../services';

export const Instructions: React.FC = () => {
	const { pullUpdatesUrl } = useData('assets');
	return (
		<Box>
			<InstructionsUI mt="2em" highContrast={false}>
				<List as="ol" styleType="decimal">
					<ListItem>
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
					</ListItem>
					<ListItem>
						{sprintf(
							__(
								'After completing the steps %s will provide you the Bot Token.',
							),
							'@BotFather',
						)}
					</ListItem>
					<ListItem>
						{createInterpolateElement(
							__('Copy the token and paste into the Bot Token field below.') +
								' ' +
								sprintf(
									/* translators: %s application name */
									__('For ease, use %s'),
									'<Link />',
								),
							{
								Link: (
									<Link href="https://desktop.telegram.org" isExternal>
										{__('Telegram Desktop')}
									</Link>
								),
							},
						)}
					</ListItem>
					<ListItem>
						{__('Add the Bot as Administrator to your Channel/Group.')}
					</ListItem>
					<ListItem>
						{__('Send a test message to see if we did it right.')}
					</ListItem>
					<ListItem>
						<Text as="span" color="red.600" fontWeight="500">
							{__('For groups, disable group privacy for the bot.')}
						</Text>
						<List styleType="circle" marginInlineStart="1.5em">
							<ListItem>
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
							</ListItem>
							<ListItem>{__('Choose your bot.')}</ListItem>
							<ListItem>{__('Select "Disable".')}</ListItem>
						</List>
					</ListItem>
				</List>
			</InstructionsUI>
			<Text color="#396609">
				<b>
					{__('Tip!')}
					{'💡'}
				</b>
				&nbsp;
				<Text as="span">
					{__(
						'Updates are pulled every five minutes if someone visits your website.',
					)}
				</Text>
				&nbsp;
				<Text as="span">
					{__(
						'To make sure the updates are pulled in time, it is recommended to set up a cron on your hosting server that hits the below URL every five minutes or so.',
					)}
				</Text>
				<br />
				<Code>{pullUpdatesUrl}</Code>
			</Text>
		</Box>
	);
};
