import { Box, Text } from '@wpsocio/adapters';
import { __ } from '@wpsocio/i18n';

export const ProxyDisclaimer: React.FC = () => {
	return (
		<Box my="0.5em">
			<Text color="red.500" fontWeight="500" as="span">
				{__('DISCLAIMER!')}
			</Text>
			&nbsp;
			<Text as="em">{__('Use the proxy at your own risk!')}</Text>
		</Box>
	);
};
