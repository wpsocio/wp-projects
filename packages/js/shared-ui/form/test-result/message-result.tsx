import { __ } from '@wpsocio/i18n';
import type {
	TestResult,
	TestResultType,
} from '@wpsocio/services/apiFetch/types.js';
import { cn } from '@wpsocio/ui-components';
import { Alert } from '@wpsocio/ui-components/wrappers/alert.jsx';

interface MessageResultProps {
	messageResult: TestResult;
	messageResultType: TestResultType;
}

export const MessageResult: React.FC<MessageResultProps> = ({
	messageResult,
	messageResultType,
}) => {
	const [[chat_id, result] = []] = Object.entries(messageResult);

	const resultType = messageResultType?.[chat_id ?? ''];

	return result ? (
		<div className="mt-4">
			<Alert
				title={__('Test Result:')}
				type={resultType === 'ERROR' ? 'error' : 'success'}
				className="max-w-max"
			>
				<div className="flex flex-wrap gap-3" key={chat_id}>
					<div className="min-w-max">
						<span className="font-semibold">{chat_id}</span>
					</div>
					<span
						className={cn('font-semibold', {
							'text-green-600': resultType === 'SUCCESS',
						})}
					>
						{result}
					</span>
				</div>
			</Alert>
		</div>
	) : null;
};
