import { Link, type LinkProps, Text, type TextProps } from '@wpsocio/adapters';
import { __, sprintf } from '@wpsocio/i18n';

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

export interface UpsellProps extends TextProps {
	location: Location;
	breakLine?: boolean;
}

const PLACEHOLDER_LOCATIONS: Array<Location> = [
	'rules',
	'template',
	'delay',
	'proxy-method',
];

const hoverProps = { textDecoration: 'none' };

const UpsellButton: React.FC<LinkProps> = ({ children, ...props }) => {
	return (
		<Link
			href="https://wptelegram.pro"
			size="sm"
			isExternal
			colorScheme="blue"
			className="button-primary"
			_hover={hoverProps}
			{...props}
		>
			{children || __('Upgrade to Pro')}
		</Link>
	);
};

export const Upsell: React.FC<UpsellProps> = ({
	breakLine,
	location,
	...props
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
		<Text fontWeight="500" my="0.5em" color="#6d6d6d" {...props}>
			{message}
			{breakLine ? (
				<>
					<br />
					<br />
				</>
			) : (
				<>&ensp;</>
			)}
			<UpsellButton>{buttonText}</UpsellButton>
		</Text>
	);
};
