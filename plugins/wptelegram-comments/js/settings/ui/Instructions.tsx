import { Link, List, ListItem } from '@wpsocio/adapters';
import { Code, Instructions as InstructionsUI } from '@wpsocio/components';
import { __, sprintf } from '@wpsocio/i18n';
import { createInterpolateElement } from '@wpsocio/utilities';

const { location } = window;

export const Instructions: React.FC = () => {
	return (
		<InstructionsUI>
			<List as="ol" styleType="decimal">
				<ListItem>
					{createInterpolateElement(
						sprintf(
							/* translators: 1 URL */
							__('Goto %s.'),
							'<Link />',
						),
						{
							Link: (
								<Link href="https://comments.app" isExternal>
									comments.app
								</Link>
							),
						},
					)}
				</ListItem>
				<ListItem>
					{createInterpolateElement(
						sprintf(
							/* translators: 1 menu name, 2, 3 buttons */
							__('Under %1$s click on %2$s or %3$s.'),
							'<Section />',
							'<Button1 />',
							'<Button2 />',
						),
						{
							Section: <b>Comments for websites</b>,
							Button1: <b>LOG IN TO CONNECT</b>,
							Button2: <b>CONNECT WEBSITE</b>,
						},
					)}
				</ListItem>
				<ListItem>
					{createInterpolateElement(
						sprintf(
							/* translators: 1 field name, 2 website address, 3 field name */
							__('Enter your site name in %1$s field and %2$s in %3$s field.'),
							'<SiteName />',
							'<Host />',
							'<Domains />',
						),
						{
							SiteName: <b>Site Name</b>,
							Host: <Code>{location.host}</Code>,
							Domains: <b>Domains</b>,
						},
					)}
				</ListItem>
				<ListItem>
					{createInterpolateElement(
						sprintf(
							/* translators: 1 button name */
							__('Click on %s and customize the appearance if you want.'),
							'<Button />',
						),
						{
							Button: <b>CONNECT WEBSITE</b>,
						},
					)}
				</ListItem>
				<ListItem>
					{createInterpolateElement(
						sprintf(
							/* translators: 1, 2 button names */
							__('Click on %1$s and %2$s.'),
							'<Button1 />',
							'<Button2 />',
						),
						{
							Button1: <b>SAVE</b>,
							Button2: <b>COPY CODE</b>,
						},
					)}
				</ListItem>
				<ListItem>{__('Paste the copied code in the field below.')}</ListItem>
				<ListItem>{__('Save Changes')}</ListItem>
			</List>
		</InstructionsUI>
	);
};
