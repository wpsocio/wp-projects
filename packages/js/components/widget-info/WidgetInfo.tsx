import { __, sprintf } from '@wpsocio/i18n';
import { Link } from '@wpsocio/adapters';
import { createInterpolateElement } from '@wpsocio/utilities';
import { Code } from '../Code';
import { Smile } from '../Smile';

import { WidgetInfoCard } from './WidgetInfoCard';
import { WidgetInfoItem } from './WidgetInfoItem';

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
			<WidgetInfoItem textAlign="start">
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
			<WidgetInfoItem textAlign="start">
				{__(
					'Alternately, you can use the below shortcode or the block available in block editor.',
				)}
			</WidgetInfoItem>
			<WidgetInfoItem>{__('Inside page or post content:')}</WidgetInfoItem>
			<WidgetInfoItem>
				<Code width="100%">{shortcode1}</Code>
			</WidgetInfoItem>
			<WidgetInfoItem>{__('Inside the theme templates')}</WidgetInfoItem>
			<WidgetInfoItem>
				<Code width="100%">{`<?php\n${phpCode}\n?>`}</Code>
				<br />
				<span>{__('or')}</span>
				<br />
				<Code width="100%">
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
