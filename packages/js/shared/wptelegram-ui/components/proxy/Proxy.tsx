import { Box, SimpleGrid } from '@wpsocio/adapters';
import { Description, SectionCard, YouTubeVideo } from '@wpsocio/components';
import { FormField } from '@wpsocio/form';
import { __ } from '@wpsocio/i18n';

import { getFieldLabel } from '../../services';
import { ActiveField } from '../ActiveField';
import { IfActive } from '../IfActive';
import type { CommonProps } from '../types';
import { ProxyDisclaimer } from './ProxyDisclaimer';
import { ProxySettings } from './ProxySettings';

const getProxyOptions = () => [
	{
		value: 'cf_worker',
		label: __('Cloudflare worker'),
	},
	{
		value: 'google_script',
		label: __('Google Script'),
	},
	{
		value: 'php_proxy',
		label: __('PHP Proxy'),
	},
];

const columns = { sm: 1, md: 2 };

export const ProxyUI: React.FC<CommonProps> = ({ prefix }) => {
	return (
		<>
			<Description>
				{__(
					'The module will help you bypass the ban on Telegram by making use of proxy.',
				)}
			</Description>
			<SimpleGrid columns={columns} spacing="1em">
				<ProxyDisclaimer />
				<Box>
					<YouTubeVideo title={__('Proxy')} videoId="J5H0QuSmo-s" asGridCol />
				</Box>
			</SimpleGrid>

			<ActiveField prefix={prefix} />

			<IfActive name={`${prefix}.active`}>
				<SectionCard title={__('Proxy Method')}>
					<FormField
						name={`${prefix}.proxy_method`}
						fieldType="radio"
						label={getFieldLabel('proxy_method')}
						description={__('Cloudflare worker is preferred.')}
						isInline
						options={getProxyOptions()}
					/>
				</SectionCard>

				<ProxySettings prefix={prefix} />
			</IfActive>
		</>
	);
};
