import {
	Card,
	CardBody,
	CardHeader,
	ExternalLink,
} from '@wordpress/components';
import { createInterpolateElement } from '@wordpress/element';
import { __, sprintf } from '@wordpress/i18n';
import { Code } from '@wpsocio/components/code';

const { location } = window;

export const Instructions: React.FC = () => {
	return (
		<Card className="wpsocio-instructions">
			<CardHeader>
				<h2>{__('Instructions')}</h2>
			</CardHeader>
			<CardBody>
				<ol>
					<li>
						{createInterpolateElement(
							sprintf(
								/* translators: 1 URL */
								__('Goto %s.'),
								'<Link />',
							),
							{
								Link: (
									<ExternalLink href="https://comments.app">
										comments.app
									</ExternalLink>
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
								__(
									'Enter your site name in %1$s field and %2$s in %3$s field.',
								),
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
			</CardBody>
		</Card>
	);
};
