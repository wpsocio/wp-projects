import { __, sprintf } from '@wpsocio/i18n';
import { Link } from '@wpsocio/ui-components/wrappers/link.js';
import { createInterpolateElement } from '@wpsocio/utilities/createInterpolateElement.js';
import { Code } from '../components/code.js';
import { Instructions as InstructionsUI } from '../components/instructions.js';
import { VariableButton } from '../components/variable-button.js';
import { YouTubeVideo } from '../components/youtube-video.js';

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
		<InstructionsUI className="mt-6">
			<div className="grid grid-cols-1 xl:grid-cols-2 gap-4 auto-cols-max">
				<div>
					<ol className="ms-8 list-decimal">
						<li>
							{__('To receive notifications privately:')}
							<ol className="ms-4 list-decimal">
								<li>
									{createInterpolateElement(
										sprintf(
											/* translators: 1 bot username */
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
								</li>
								<li className="text-destructive">
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
								</li>
							</ol>
						</li>
						<li>
							{__('To receive notifications into a group:')}
							<ol className="ms-4 list-decimal">
								<li>
									{createInterpolateElement(
										sprintf(
											/* translators: 1 bot username */
											__('Add %s to the group to get its Chat ID.'),
											'<BotLink />',
										),
										{
											BotLink: (
												<Link
													href="https://t.me/MyChatInfoBot?startgroup=true"
													isExternal
												>
													@MyChatInfoBot
												</Link>
											),
										},
									)}
								</li>
								<li>
									{createInterpolateElement(
										sprintf(
											/* translators: 1 field name */
											__('Enter the Chat ID in %s field below.'),
											'<Field />',
										),
										{
											Field: <b>{__('Send it to')}</b>,
										},
									)}
								</li>
								<li>
									{createInterpolateElement(
										sprintf(
											/* translators: 1 bot username */
											__('Add your own bot %s to the group.'),
											'<BotLink />',
										),
										{
											BotLink: (
												<Link
													href={`https://t.me/${botUsername}?startgroup=true`}
													isExternal
												>
													{`@${botUsername}`}
												</Link>
											),
										},
									)}
								</li>
							</ol>
						</li>
					</ol>
				</div>
				<div>
					<YouTubeVideo
						title={__('Private Notifications')}
						videoId={videoId}
						asGridCol
					/>
				</div>
			</div>
		</InstructionsUI>
	);
};
