import { Card, CardBody, CardHeader } from '@wordpress/components';
import { __ } from '@wordpress/i18n';
import { CodeField } from './CodeField';
import { usePluginData } from './hooks/usePluginData';

export const Configuration: React.FC = () => {
	const { savedSettings } = usePluginData();
	return (
		<Card>
			<CardHeader>
				<h2>{__('Configuration')}</h2>
			</CardHeader>
			<CardBody>
				<CodeField />
			</CardBody>
		</Card>
	);
};
