import { ProxyUI as ProxyOptions } from '@wpsocio/shared-wptelegram-ui';

import { PREFIX } from './constants';

export const ProxyUI: React.FC = () => {
	return <ProxyOptions prefix={PREFIX} />;
};
