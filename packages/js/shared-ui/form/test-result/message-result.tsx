import { __ } from '@wpsocio/i18n';
import type {
	TestResult,
	TestResultType,
} from '@wpsocio/services/apiFetch/types.js';
import { cn } from '@wpsocio/ui-components';

interface MessageResultProps {
	messageResult: TestResult;
	messageResultType: TestResultType;
}

export const MessageResult: React.FC<MessageResultProps> = ({
	messageResult,
	messageResultType,
}) => {
	const testResults = Object.entries(messageResult);

	return testResults.length ? (
		<div className="mt-4">
			<p className="text-gray-500">{__('Result:')}</p>
			{testResults.map(([chat_id, result]) => {
				return (
					<div className="flex py-4 flex-wrap" key={chat_id}>
						<div className="min-w-[150px]">
							<span className="font-bold">{chat_id}</span>
						</div>
						<div className="ms-4">
							<span
								className={cn('font-bold', {
									'text-red-600': messageResultType?.[chat_id] === 'ERROR',
									'text-green-600': messageResultType?.[chat_id] === 'SUCCESS',
								})}
							>
								{result}
							</span>
						</div>
					</div>
				);
			})}
		</div>
	) : null;
};
