import { __, sprintf } from '@wpsocio/i18n';
import { FormControl } from '@wpsocio/ui-components/ui/form.js';
import { Input } from '@wpsocio/ui-components/wrappers/input.jsx';
import { RadioGroup } from '@wpsocio/ui-components/wrappers/radio-group.js';
import { prefixName } from '@wpsocio/utilities/misc.js';
import { FormField } from '../../form/form-field.js';
import { FormItem } from '../../form/form-item.js';
import { getFieldLabel } from '../fields.js';
import type { CommonProps } from '../types.js';

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
		<div className="flex flex-col gap-8 md:gap-0">
			<FormField
				name={prefixName('proxy_host', prefix)}
				render={({ field }) => (
					<FormItem
						label={getFieldLabel('proxy_host')}
						description={sprintf(
							/* translators: IP address */ __(
								'Host IP or domain name like %s.',
							),
							'192.168.84.101',
						)}
					>
						<FormControl className="max-w-[300px]">
							<Input
								autoComplete="off"
								placeholder="192.168.84.101"
								{...field}
							/>
						</FormControl>
					</FormItem>
				)}
			/>
			<FormField
				name={prefixName('proxy_port', prefix)}
				render={({ field }) => (
					<FormItem
						label={getFieldLabel('proxy_port')}
						description={sprintf(
							/* translators: proxy port */ __('Target Port like %s.'),
							'8080',
						)}
					>
						<FormControl className="max-w-[150px]">
							<Input
								autoComplete="off"
								placeholder="8080"
								type="number"
								{...field}
							/>
						</FormControl>
					</FormItem>
				)}
			/>
			<FormField
				name={prefixName('proxy_type', prefix)}
				render={({ field }) => (
					<FormItem label={getFieldLabel('proxy_type')}>
						<FormControl>
							<RadioGroup
								{...field}
								onValueChange={field.onChange}
								defaultValue={field.value}
								options={getProxyTypeOptions()}
							/>
						</FormControl>
					</FormItem>
				)}
			/>
			<FormField
				name={prefixName('proxy_username', prefix)}
				render={({ field }) => (
					<FormItem
						description={__('Leave empty if not required.')}
						label={getFieldLabel('proxy_username')}
					>
						<FormControl className="max-w-[300px]">
							<Input autoComplete="off" {...field} />
						</FormControl>
					</FormItem>
				)}
			/>
			<FormField
				name={prefixName('proxy_password', prefix)}
				render={({ field }) => (
					<FormItem
						description={__('Leave empty if not required.')}
						label={getFieldLabel('proxy_password')}
					>
						<FormControl className="max-w-[300px]">
							<Input autoComplete="off" type="password" {...field} />
						</FormControl>
					</FormItem>
				)}
			/>
		</div>
	);
};
