import { __, sprintf } from '@wpsocio/i18n';
import { Link } from '@wpsocio/ui-components/wrappers/link.jsx';
import { createInterpolateElement } from '@wpsocio/utilities/createInterpolateElement.js';
import { Code } from '../code.js';
import { Smile } from '../smile.js';
import { WidgetInfoCard } from './widget-info-card.jsx';
import { WidgetInfoItem } from './widget-info-item.jsx';

export interface WidgetInfoProps {
	adminUrl: string;
	phpCode: string;
	shortcode1: string;
	shortcode2: string;
	title: string;
}

export const WidgetInfo: React.FC<WidgetInfoProps> = ({
	adminUrl,
	phpCode,
	shortcode1,
	shortcode2,
	title,
}) => {
	return (
		<WidgetInfoCard>
			<WidgetInfoItem className="text-start">
				{createInterpolateElement(
					sprintf(
						/* translators: 1, 2 Menu names */
						__(
							'Goto %1$s and click/drag %2$s and place it where you want it to be.',
						),
						'<Path />',
						'<Widget />',
					),
					{
						Path: (
							<>
								<b>{__('Appearance')}</b> &gt;{' '}
								<Link href={`${adminUrl}/widgets.php`}>{__('Widgets')}</Link>
							</>
						),
						Widget: <b>{title}</b>,
					},
				)}
			</WidgetInfoItem>
			<WidgetInfoItem className="text-start">
				{__(
					'Alternately, you can use the below shortcode or the block available in block editor.',
				)}
			</WidgetInfoItem>
			<WidgetInfoItem>{__('Inside page or post content:')}</WidgetInfoItem>
			<WidgetInfoItem>
				<Code className="w-full">{shortcode1}</Code>
			</WidgetInfoItem>
			<WidgetInfoItem>{__('Inside the theme templates')}</WidgetInfoItem>
			<WidgetInfoItem>
				<Code className="w-full">{`<?php\n${phpCode}\n?>`}</Code>
				<br />
				<span>{__('or')}</span>
				<br />
				<Code className="w-full">
					{`<?php\n$shortcode = '${
						shortcode2 || shortcode1
					}';\necho do_shortcode( $shortcode );\n?>`}
				</Code>
			</WidgetInfoItem>
			<WidgetInfoItem>
				<Smile />
			</WidgetInfoItem>
		</WidgetInfoCard>
	);
};
