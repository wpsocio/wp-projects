import { __, sprintf } from '@wpsocio/i18n';
import { cn } from '@wpsocio/ui-components';
import { Link, type LinkProps } from '@wpsocio/ui-components/wrappers/link';

type Location =
	| 'header'
	| 'bot'
	| 'sidebar'
	| 'channels'
	| 'template'
	| 'inline-button'
	| 'delay'
	| 'rules'
	| 'watch-emails'
	| 'proxy-method';

export interface UpsellProps {
	className?: string;
	location: Location;
	breakLine?: boolean;
}

const PLACEHOLDER_LOCATIONS: Array<Location> = [
	'rules',
	'template',
	'delay',
	'proxy-method',
];

const UpsellButton: React.FC<LinkProps> = ({ children, ...props }) => {
	return (
		<Link
			href="https://wptelegram.pro"
			isExternal
			className="button-primary text-neutral-50"
			{...props}
		>
			{children || __('Upgrade to Pro')}
		</Link>
	);
};

export const Upsell: React.FC<UpsellProps> = ({
	breakLine,
	location,
	className,
}) => {
	let message = __('Want an absolute integration with Telegram?');

	switch (location) {
		case 'bot':
			message = __('Want to add more bots?');
			break;

		case 'sidebar':
			message = __('Need more features?');
			break;

		case 'channels':
			message = __('Want to use different channels for different categories?');
			break;

		case 'rules':
			message = sprintf(
				/* translators: %s: plugin name */
				__(
					'%s supports multiple instances of Post to Telgram with different rules.',
				),
				__('WP Telegram Pro'),
			);
			break;

		case 'template':
			message = sprintf(
				/* translators: %s: plugin name */
				__('%s supports ALL WooCommerce and ACF text fields.'),
				__('WP Telegram Pro'),
			);
			break;

		case 'inline-button':
			message = __('Want to add more buttons?');
			break;

		case 'delay':
			message = sprintf(
				/* translators: %s: plugin name */
				__('%s supports delay per channel.'),
				__('WP Telegram Pro'),
			);
			break;

		case 'watch-emails':
			message = __('Want to add more emails?');
			break;

		case 'proxy-method':
			message = sprintf(
				/* translators: %s: plugin name */
				__('%s supports Cloudflare proxy for featured image upload!'),
				__('WP Telegram Pro'),
			);
			break;
	}

	// If message contains placeholder.
	const buttonText =
		PLACEHOLDER_LOCATIONS.includes(location) && __('Upgrade NOW');

	return (
		<p className={cn('font-medium my-6', className)}>
			<span className="text-gray-500">
				{message}
				{breakLine ? (
					<>
						<br />
						<br />
					</>
				) : (
					<>&ensp;</>
				)}
			</span>
			<UpsellButton>{buttonText}</UpsellButton>
		</p>
	);
};
