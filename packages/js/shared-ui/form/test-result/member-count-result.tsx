import { __ } from '@wpsocio/i18n';
import type {
	TestResult,
	TestResultType,
} from '@wpsocio/services/apiFetch/types.js';
import { cn } from '@wpsocio/ui-components';
import { Alert } from '@wpsocio/ui-components/wrappers/alert.jsx';

interface MemberCountResultProps {
	memberCountResult: TestResult;
	memberCountResultType: TestResultType;
}

export const MemberCountResult: React.FC<MemberCountResultProps> = ({
	memberCountResult,
	memberCountResultType,
}) => {
	const [[chat_id, result] = []] = Object.entries(memberCountResult);

	const resultType = memberCountResultType?.[chat_id ?? ''];

	return result ? (
		<div className="mt-4">
			<Alert
				title={__('Members Count:')}
				type={resultType === 'ERROR' ? 'error' : 'success'}
				className="max-w-max"
			>
				<div className="flex flex-wrap gap-3">
					<div className="min-w-[150px]">
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
