import { __ } from '@wpsocio/i18n';
import { FormControl } from '@wpsocio/ui/components/form';
import { RadioGroup } from '@wpsocio/ui/wrappers/radio-group';
import { SectionCard } from '../../components/section-card.js';
import { YouTubeVideo } from '../../components/youtube-video.js';
import { FormField } from '../../form/form-field.js';
import { FormItem } from '../../form/form-item.js';
import { ActiveField } from '../active-field.js';
import { getFieldLabel } from '../fields.js';
import { IfActive } from '../if-active.js';
import type { CommonProps } from '../types.js';
import { ProxyDisclaimer } from './proxy-disclaimer.js';
import { ProxySettings } from './proxy-settings.js';

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

export const ProxyUI: React.FC<CommonProps> = ({ prefix }) => {
	return (
		<>
			<ActiveField prefix={prefix} />

			<IfActive name={`${prefix}.active`}>
				<div className="grid grid-cols-1 xl:grid-cols-2 gap-4 auto-cols-max my-6">
					<ProxyDisclaimer />
					<YouTubeVideo title={__('Proxy')} videoId="J5H0QuSmo-s" asGridCol />
				</div>
				<SectionCard title={__('Proxy Method')} className="mt-6">
					<FormField
						name={`${prefix}.proxy_method`}
						render={({ field }) => (
							<FormItem
								label={getFieldLabel('proxy_method')}
								description={__('Cloudflare worker is preferred.')}
							>
								<FormControl>
									<RadioGroup
										{...field}
										onValueChange={field.onChange}
										defaultValue={field.value}
										options={getProxyOptions()}
									/>
								</FormControl>
							</FormItem>
						)}
					/>
				</SectionCard>

				<ProxySettings prefix={prefix} />
			</IfActive>
		</>
	);
};
