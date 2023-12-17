import { Text } from '@wpsocio/adapters';
import { __ } from '@wpsocio/i18n';
import { VerticalDivider } from '@wpsocio/components';

export const And: React.FC = () => {
	return (
		<VerticalDivider height="0.5em">
			<Text>{__('AND')}</Text>
		</VerticalDivider>
	);
};
