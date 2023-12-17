import { useWatch } from '@wpsocio/form';
import { SectionCard } from '@wpsocio/components';
import { __ } from '@wpsocio/i18n';
import { Collapse } from '@wpsocio/adapters';

import { CFWorker } from './CFWorker';
import { GoogleScript } from './GoogleScript';
import { PHPProxy } from './PHPProxy';
import type { CommonProps } from '../types';

export const ProxySettings: React.FC<CommonProps> = ({ prefix }) => {
	const proxy_method = useWatch({
		name: `${prefix}.proxy_method`,
	});

	return proxy_method ? (
		<SectionCard title={__('Proxy settings')}>
			<Collapse in={proxy_method === 'cf_worker'} animateOpacity>
				<CFWorker prefix={prefix} />
			</Collapse>
			<Collapse in={proxy_method === 'google_script'} animateOpacity>
				<GoogleScript prefix={prefix} />
			</Collapse>
			<Collapse in={proxy_method === 'php_proxy'} animateOpacity>
				<PHPProxy prefix={prefix} />
			</Collapse>
		</SectionCard>
	) : null;
};
