import { __ } from '@wpsocio/i18n';
import { Alert } from '@wpsocio/ui-components/wrappers/alert.js';

export const ProxyDisclaimer: React.FC = () => {
	return (
		<Alert className="my-2 h-max max-w-max" title={__('DISCLAIMER!')}>
			<em>{__('Use the proxy at your own risk!')}</em>
		</Alert>
	);
};
