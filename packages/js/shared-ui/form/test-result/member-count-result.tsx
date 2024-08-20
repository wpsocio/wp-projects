import { __ } from '@wpsocio/i18n';
import type {
	TestResult,
	TestResultType,
} from '@wpsocio/services/apiFetch/types.js';
import { cn } from '@wpsocio/ui-components';

interface MemberCountResultProps {
	memberCountResult: TestResult;
	memberCountResultType: TestResultType;
}

export const MemberCountResult: React.FC<MemberCountResultProps> = ({
	memberCountResult,
	memberCountResultType,
}) => {
	const result = Object.entries(memberCountResult);

	return result.length ? (
		<div className="mt-4">
			<p className="text-gray.500">{__('Members Count:')}</p>
			{result.map(([chat_id, result]) => {
				return (
					<div className="flex flex-row flex-wrap py-4" key={chat_id}>
						<div className="min-w-[150px]">
							<span className="font-bold">{chat_id}</span>
						</div>
						<div className="ms-4">
							<span
								className={cn('font-bold', {
									'text-red-600': memberCountResultType?.[chat_id] === 'ERROR',
									'text-green-600':
										memberCountResultType?.[chat_id] === 'SUCCESS',
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
