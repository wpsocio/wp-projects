import { __, sprintf } from '@wpsocio/i18n';
import { Link } from '@wpsocio/ui/wrappers/link';
import { createInterpolateElement } from '@wpsocio/utilities/createInterpolateElement.js';
import { Code } from '../components/code.js';
import { Instructions as InstructionsUI } from '../components/instructions.js';
import { VariableButton } from '../components/variable-button.js';
import { YouTubeVideo } from '../components/youtube-video.js';

export interface P2TGInstructionsProps {
	botUsername: string;
	videoId: string;
}

export const P2TGInstructions: React.FC<P2TGInstructionsProps> = ({
	botUsername,
	videoId,
}) => {
	return (
		<InstructionsUI className="mt-6">
			<div className="grid grid-cols-1 xl:grid-cols-2 gap-4 auto-cols-max">
				<div>
					<ol className="ms-6 sm:ms-8 list-decimal">
						<li>{__('Create a Telegram channel or group.')}</li>
						<li>
							{createInterpolateElement(
								sprintf(
									/* translators: %s bot username */
									__('Add your bot %s as Administrator to your Channel/Group.'),
									'<Username />',
								),
								{
									Username: (
										<>
											(<VariableButton content={`@${botUsername}`} />)
										</>
									),
								},
							)}
						</li>
						<li>{__('Enter the Channel Username in the field below.')}</li>
						<ul className="ms-8 list-disc">
							<li>
								<span>
									{createInterpolateElement(
										sprintf(
											/* translators: %s symbol - @ */
											__('Username must start with %s'),
											'<Prefix />',
										),
										{
											Prefix: <VariableButton content="@" />,
										},
									)}
								</span>
							</li>
							<li>
								<span>
									{__(
										'You can also use the Chat ID of a group or private chat.',
									)}
									&nbsp;
									<span>
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
									</span>
								</span>
							</li>
							<li>
								<span>
									<span>
										{createInterpolateElement(
											sprintf(
												/* translators: %s colon character */
												__(
													'If you want to send posts to a specific topic in a group with topics enabled, you can add a colon (%s) to the chat ID followed by topic ID.',
												),
												'<Colon />',
											),
											{
												Colon: <VariableButton content=":" />,
											},
										)}
									</span>
									&nbsp;
									<span>
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
									</span>
								</span>
							</li>
						</ul>
						<li>
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
						</li>
					</ol>
				</div>
				<div>
					<YouTubeVideo
						title={__('Introduction')}
						videoId={videoId}
						asGridCol
					/>
				</div>
			</div>
			<div className="mt-8">
				<div className="text-green-800">
					<b>
						{__('Tip!')}
						{'💡'}
					</b>
					&nbsp;
					<span>
						{__(
							'You can add an internal note to the chat ID to make it easier for you to identify it.',
						)}
					</span>
					&nbsp;
					<span>
						{createInterpolateElement(
							sprintf(
								/* translators: %s pipe character */
								__('Note can be added after %s.'),
								'<code />',
							),
							{
								code: <VariableButton content="|" codeClassName="p-0" />,
							},
						)}
					</span>
					<br />
					<span>
						{sprintf(
							/* translators: %s code example */
							__('For example %s'),
							'👇',
						)}
					</span>
				</div>
				<ul className="ms-8 mt-4 list-disc">
					<li>
						<code>{'-1000123456789|Internal Testing'}</code>
					</li>
					<li>
						<code>{'-1000987654321:123|Forum topic'}</code>
					</li>
					<li>
						<code>{'987654321|My Chat ID'}</code>
					</li>
					<li>
						<code>{'@WPTelegramChat | ملاحظة هنا'}</code>
					</li>
				</ul>
			</div>
		</InstructionsUI>
	);
};
