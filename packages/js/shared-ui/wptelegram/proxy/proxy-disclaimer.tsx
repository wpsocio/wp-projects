import { __ } from '@wpsocio/i18n';
import { Alert } from '@wpsocio/ui/wrappers/alert';

export const ProxyDisclaimer: React.FC = () => {
	return (
		<Alert className="my-2 h-max max-w-max" title={__('DISCLAIMER!')}>
			<em>{__('Use the proxy at your own risk!')}</em>
		</Alert>
	);
};
