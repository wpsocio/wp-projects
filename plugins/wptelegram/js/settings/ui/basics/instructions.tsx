import { __, sprintf } from '@wpsocio/i18n';
import { Instructions as InstructionsUI } from '@wpsocio/shared-ui/components/instructions';
import { VariableButton } from '@wpsocio/shared-ui/components/variable-button';
import { YouTubeVideo } from '@wpsocio/shared-ui/components/youtube-video.js';
import { Link } from '@wpsocio/ui-components/wrappers/link.js';
import { createInterpolateElement } from '@wpsocio/utilities/createInterpolateElement.js';

export const Instructions: React.FC = () => {
	return (
		<InstructionsUI>
			<div className="grid grid-cols-1 xl:grid-cols-2 gap-4 auto-cols-max">
				<div>
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
									Command: <VariableButton>{'/newbot'}</VariableButton>,
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
						<li>{__('Test your bot token below.')}</li>
						<li>{__('Activate the modules you want to use.')}</li>
						<li>{__('Configure the activated modules.')}</li>
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
						videoId="m48V-gWz9-o"
						asGridCol
					/>
				</div>
			</div>
		</InstructionsUI>
	);
};
