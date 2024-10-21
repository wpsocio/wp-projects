import { __, sprintf } from '@wpsocio/i18n';
import { Link } from '@wpsocio/ui-components/wrappers/link.js';
import { insertScript } from '@wpsocio/utilities/misc.js';
import { useEffect } from 'react';

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
		<div className="flex flex-col gap-4 items-center">
			<div>
				<div
					className="fb-like"
					data-href="https://www.facebook.com/WPTelegram"
					data-layout="button_count"
					data-action="like"
					data-size="small"
					data-show-faces="false"
					data-share="false"
				/>
			</div>
			<div>
				<a
					href="https://twitter.com/WPTelegram"
					className="twitter-follow-button"
					data-show-count="false"
				>
					{sprintf(
						/* translators: %s: social handle */
						__('Follow %s'),
						'@WPTelegram',
					)}
				</a>
			</div>
			<div>
				<Link
					href="https://t.me/WPTelegram"
					className="flex items-center bg-[#17a2b8] rounded-md py-px px-1 whitespace-nowrap"
					isExternal
				>
					<img src={tgIconUrl} alt="" className="me-1 size-3 align-middle" />
					<small className="text-white text-sm">
						{sprintf(
							/* translators: %s: channel name */
							__('Join %s'),
							'@WPTelegram',
						)}
					</small>
				</Link>
			</div>
		</div>
	);
};
