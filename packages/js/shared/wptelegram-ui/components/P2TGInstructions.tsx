import { Box, Link, List, ListItem, SimpleGrid, Text } from '@wpsocio/adapters';
import {
	Code,
	Instructions as InstructionsUI,
	YouTubeVideo,
} from '@wpsocio/components';
import { __, sprintf } from '@wpsocio/i18n';
import { createInterpolateElement } from '@wpsocio/utilities';

export interface P2TGInstructionsProps {
	botUsername: string;
	videoId: string;
}

const columns = { sm: 1, md: 2 };

export const P2TGInstructions: React.FC<P2TGInstructionsProps> = ({
	botUsername,
	videoId,
}) => {
	return (
		<InstructionsUI highContrast={false}>
			<SimpleGrid columns={columns} spacing="1em">
				<Box>
					<List as="ol" styleType="decimal">
						<ListItem>{__('Create a Telegram channel or group.')}</ListItem>
						<ListItem>
							{createInterpolateElement(
								sprintf(
									/* translators: %s bot username */
									__('Add your bot %s as Administrator to your Channel/Group.'),
									'<Username />',
								),
								{
									Username: (
										<>
											(<Code>@{botUsername}</Code>)
										</>
									),
								},
							)}
						</ListItem>
						<ListItem>
							{__('Enter the Channel Username in the field below.')}
						</ListItem>
						<List styleType="disc" ms="2rem">
							<ListItem>
								{createInterpolateElement(
									sprintf(
										/* translators: %s symbol - @ */
										__('Username must start with %s'),
										'<Symbol />',
									),
									{
										Symbol: <Code>@</Code>,
									},
								)}
							</ListItem>
							<ListItem>
								{__('You can also use the Chat ID of a group or private chat.')}
								&nbsp;
								{createInterpolateElement(
									sprintf(
										/* translators: %s bot username */
										__('Get it from %s.'),
										'<BotLink />',
									),
									{
										BotLink: (
											<Link href="https://t.me/MyChatInfoBot" isExternal>
												@MyChatInfoBot
											</Link>
										),
									},
								)}
							</ListItem>
							<ListItem>
								{createInterpolateElement(
									sprintf(
										/* translators: %s colon character */
										__(
											'If you want to send posts to a specific topic in a group with topics enabled, you can add a colon (%s) to the chat ID followed by topic ID.',
										),
										'<Colon />',
									),
									{
										Colon: <Code>:</Code>,
									},
								)}
								&nbsp;
								{createInterpolateElement(
									sprintf(
										/* translators: %s code example */
										__('For example %s'),
										'<Ex />',
									),
									{
										Ex: <Code>{'-100012345678:102'}</Code>,
									},
								)}
							</ListItem>
						</List>
						<ListItem>
							{createInterpolateElement(
								sprintf(
									/* translators: %s button name */
									__('Hit %s below.'),
									'<Button />',
								),
								{
									Button: <b>{__('Save Changes')}</b>,
								},
							)}
						</ListItem>
					</List>
				</Box>
				<Box>
					<YouTubeVideo
						title={__('Introduction')}
						videoId={videoId}
						asGridCol
					/>
				</Box>
			</SimpleGrid>
			<Box mt="2rem">
				<Text color="#396609">
					<b>
						{__('Tip!')}
						{'💡'}
					</b>
					&nbsp;
					<Text as="span">
						{__(
							'You can add an internal note to the chat ID to make it easier for you to indentify it.',
						)}
					</Text>
					&nbsp;
					<Text as="span">
						{createInterpolateElement(
							sprintf(
								/* translators: %s pipe character */
								__('Note can be added after %s.'),
								'<code />',
							),
							{
								code: <code>{'|'}</code>,
							},
						)}
					</Text>
					<br />
					<Text as="span">
						{sprintf(
							/* translators: %s code example */
							__('For example %s'),
							'👇',
						)}
					</Text>
				</Text>
				<List styleType="disc" ms="2rem" mt="1rem">
					<ListItem>
						<code>{'-1000123456789|Internal Testing'}</code>
					</ListItem>
					<ListItem>
						<code>{'-1000987654321:123|Forum topic'}</code>
					</ListItem>
					<ListItem>
						<code>{'987654321|My Chat ID'}</code>
					</ListItem>
					<ListItem>
						<code>{'@WPTelegramChat | ملاحظة هنا'}</code>
					</ListItem>
				</List>
			</Box>
		</InstructionsUI>
	);
};
