import { useWatch } from '@wpsocio/form';
import { __ } from '@wpsocio/i18n';
import { SectionCard } from '../../components/section-card.js';
import type { CommonProps } from '../types.js';
import { CFWorker } from './cf-worker.jsx';
import { GoogleScript } from './google-script.jsx';
import { PHPProxy } from './php-proxy.jsx';

export const ProxySettings: React.FC<CommonProps> = ({ prefix }) => {
	const proxy_method = useWatch({
		name: `${prefix}.proxy_method`,
	});

	return proxy_method ? (
		<SectionCard title={__('Proxy settings')}>
			{proxy_method === 'cf_worker' && <CFWorker prefix={prefix} />}
			{proxy_method === 'google_script' && <GoogleScript prefix={prefix} />}
			{proxy_method === 'php_proxy' && <PHPProxy prefix={prefix} />}
		</SectionCard>
	) : null;
};
