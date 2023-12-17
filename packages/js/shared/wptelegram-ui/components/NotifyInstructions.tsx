import { __, sprintf } from '@wpsocio/i18n';
import {
	Instructions as InstructionsUI,
	Code,
	YouTubeVideo,
} from '@wpsocio/components';
import { Box, List, ListItem, Link, SimpleGrid } from '@wpsocio/adapters';
import { createInterpolateElement } from '@wpsocio/utilities';

export interface NotifyInstructionsProps {
	botUsername: string;
	videoId: string;
}

const columns = { sm: 1, md: 2 };

export const NotifyInstructions: React.FC<NotifyInstructionsProps> = ({
	botUsername,
	videoId,
}) => {
	return (
		<InstructionsUI highContrast={false}>
			<SimpleGrid columns={columns} spacing="1em">
				<Box>
					<List styleType="circle">
						<ListItem>
							{__('To receive notifications privately:')}
							<List as="ol" styleType="decimal" ms="1em">
								<ListItem>
									{createInterpolateElement(
										/* translators: 1 bot username */
										sprintf(
											__('Get your Chat ID from %s and enter it below.'),
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
								<ListItem color="red">
									{createInterpolateElement(
										sprintf(
											/* translators: 1 bot username */
											__(
												'Send your own bot %s a message to start the conversation.',
											),
											'(<BotLink />)',
										),
										{
											BotLink: (
												<Link href={`https://t.me/${botUsername}`} isExternal>
													@{botUsername}
												</Link>
											),
										},
									)}
								</ListItem>
							</List>
						</ListItem>
						<ListItem>
							{__('To receive notifications into a group:')}
							<List as="ol" styleType="decimal" ms="1em">
								<ListItem>
									{createInterpolateElement(
										/* translators: 1 bot username */
										sprintf(
											__('Add %s to the group to get its Chat ID.'),
											'<Username />',
										),
										{
											Username: <Code>@MyChatInfoBot</Code>,
										},
									)}
								</ListItem>
								<ListItem>
									{createInterpolateElement(
										sprintf(
											__('Enter the Chat ID in %s field below.'),
											'<Field />',
										),
										{
											Field: <b>{__('Send it to')}</b>,
										},
									)}
								</ListItem>
								<ListItem>
									{createInterpolateElement(
										sprintf(
											/* translators: 1 bot username */
											__('Add your own bot %s to the group.'),
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
							</List>
						</ListItem>
					</List>
				</Box>
				<Box>
					<YouTubeVideo
						title={__('Private Notifications')}
						videoId={videoId}
						asGridCol
					/>
				</Box>
			</SimpleGrid>
		</InstructionsUI>
	);
};
