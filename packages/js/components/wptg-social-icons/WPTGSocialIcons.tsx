import { Box, Stack, StackItem, Text, Link } from '@wpsocio/adapters';
import { __, sprintf } from '@wpsocio/i18n';
import { insertScript } from '@wpsocio/utilities';
import { useEffect } from 'react';

import './styles.scss';

export interface WPTGSocialIconsProps {
	tgIconUrl: string;
}

export const WPTGSocialIcons: React.FC<WPTGSocialIconsProps> = ({
	tgIconUrl,
}) => {
	useEffect(() => {
		insertScript(
			'facebook-jssdk',
			'//connect.facebook.net/en_GB/sdk.js#xfbml=1&version=v2.9',
		);
		insertScript('twitter-widget', 'https://platform.twitter.com/widgets.js');
	}, []);

	return (
		<Stack
			direction="column"
			spacing="1em"
			className="wptelegram-social-icons"
			alignItems="center"
		>
			<StackItem className="wptelegram-social-icons__icon">
				<Box
					className="fb-like"
					data-href="https://www.facebook.com/WPTelegram"
					data-layout="button_count"
					data-action="like"
					data-size="small"
					data-show-faces="false"
					data-share="false"
				></Box>
			</StackItem>
			<StackItem className="wptelegram-social-icons__icon">
				<Box
					as="a"
					href="https://twitter.com/WPTelegram"
					className="twitter-follow-button"
					data-show-count="false"
				>
					{sprintf(__('Follow %s'), '@WPTelegram')}
				</Box>
			</StackItem>
			<StackItem className="wptelegram-social-icons__icon wptelegram-social-icons__icon--telegram">
				<Link href="https://t.me/WPTelegram" isExternal whiteSpace="nowrap">
					<Box
						as="img"
						src={tgIconUrl} /* d='inline-block'  */
						role="presentation"
						verticalAlign="middle"
					/>
					<Text as="small" color="#fff">
						{sprintf(__('Join %s'), '@WPTelegram')}
					</Text>
				</Link>
			</StackItem>
		</Stack>
	);
};
