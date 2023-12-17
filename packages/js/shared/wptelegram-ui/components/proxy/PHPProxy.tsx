import { sprintf, __ } from '@wpsocio/i18n';
import { FormField } from '@wpsocio/form';
import { prefixName } from '@wpsocio/utilities';

import { getFieldLabel } from '../../services';
import type { CommonProps } from '../types';

const getProxyTypeOptions = () => [
	{
		value: 'CURLPROXY_HTTP',
		label: __('HTTP'),
	},
	{
		value: 'CURLPROXY_SOCKS4',
		label: __('SOCKS4'),
	},
	{
		value: 'CURLPROXY_SOCKS4A',
		label: __('SOCKS4A'),
	},
	{
		value: 'CURLPROXY_SOCKS5',
		label: __('SOCKS5'),
	},
	{
		value: 'CURLPROXY_SOCKS5_HOSTNAME',
		label: __('SOCKS5_HOSTNAME'),
	},
];

export const PHPProxy: React.FC<CommonProps> = ({ prefix }) => {
	return (
		<>
			<FormField
				name={prefixName('proxy_host', prefix)}
				fieldType="text"
				label={getFieldLabel('proxy_host')}
				description={sprintf(
					/* translators: IP address */ __('Host IP or domain name like %s.'),
					'192.168.84.101',
				)}
				maxWidth="300px"
				placeholder="192.168.84.101"
			/>
			<FormField
				name={prefixName('proxy_port', prefix)}
				fieldType="text"
				type="number"
				label={getFieldLabel('proxy_port')}
				description={sprintf(
					/* translators: proxy port */ __('Target Port like %s.'),
					'8080',
				)}
				maxWidth="300px"
				placeholder="8080"
			/>
			<FormField
				name={prefixName('proxy_type', prefix)}
				fieldType="radio"
				label={getFieldLabel('proxy_type')}
				options={getProxyTypeOptions()}
			/>
			<FormField
				name={prefixName('proxy_username', prefix)}
				fieldType="text"
				description={__('Leave empty if not required.')}
				label={getFieldLabel('proxy_username')}
				maxWidth="300px"
			/>
			<FormField
				name={prefixName('proxy_password', prefix)}
				fieldType="text"
				type="password"
				description={__('Leave empty if not required.')}
				label={getFieldLabel('proxy_password')}
				maxWidth="300px"
			/>
		</>
	);
};
