import { useWatch } from '@wpsocio/form';
import { __ } from '@wpsocio/i18n';

export const IfBotToken: React.FC<React.PropsWithChildren<unknown>> = ({
	children,
}) => {
	const bot_token = useWatch({ name: 'bot_token' });

	return (
		<>
			{bot_token ? (
				children
			) : (
				<p className="text-destructive">{__('You must add a bot token.')}</p>
			)}
		</>
	);
};
