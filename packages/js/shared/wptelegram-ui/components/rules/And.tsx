import { Text } from '@wpsocio/adapters';
import { VerticalDivider } from '@wpsocio/components';
import { __ } from '@wpsocio/i18n';

export const And: React.FC = () => {
	return (
		<VerticalDivider height="0.5em">
			<Text marginBlock={0}>{__('AND')}</Text>
		</VerticalDivider>
	);
};
