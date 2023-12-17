import { Text } from '@wpsocio/adapters';
import { __ } from '@wpsocio/i18n';
import { VerticalDivider } from '@wpsocio/components';

export const Or: React.FC = () => {
	return (
		<VerticalDivider>
			<Text>{__('OR')}</Text>
		</VerticalDivider>
	);
};
