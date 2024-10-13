import { __ } from '@wpsocio/i18n';
import { Alert } from '@wpsocio/ui-components/wrappers/alert.jsx';

export const ProxyDisclaimer: React.FC = () => {
	return (
		<Alert className="my-2 h-max w-max" title={__('DISCLAIMER!')} type="error">
			<em>{__('Use the proxy at your own risk!')}</em>
		</Alert>
	);
};
