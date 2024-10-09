import { __ } from '@wpsocio/i18n';

export const ProxyDisclaimer: React.FC = () => {
	return (
		<div className="my-2">
			<span className="text-destructive font-medium">{__('DISCLAIMER!')}</span>
			&nbsp;
			<em>{__('Use the proxy at your own risk!')}</em>
		</div>
	);
};
