import { __, sprintf } from '@wpsocio/i18n';
import { Code } from '@wpsocio/shared-ui/components/code.js';
import { Instructions as InstructionsUI } from '@wpsocio/shared-ui/components/instructions.js';
import { Link } from '@wpsocio/ui/wrappers/link';
import { createInterpolateElement } from '@wpsocio/utilities/createInterpolateElement.js';

export const Instructions: React.FC = () => {
	return (
		<InstructionsUI>
			<ol className="ms-8 list-decimal">
				<li>
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
				</li>
				<li>
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
				</li>
				<li>
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
							Host: (
								<b>
									<Code>{window.location.host}</Code>
								</b>
							),
							Domains: <b>Domains</b>,
						},
					)}
				</li>
				<li>
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
				</li>
				<li>
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
				</li>
				<li>{__('Paste the copied code in the field below.')}</li>
				<li>{__('Save Changes')}</li>
			</ol>
		</InstructionsUI>
	);
};
