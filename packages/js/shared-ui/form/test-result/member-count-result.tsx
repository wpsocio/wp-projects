import { __ } from '@wpsocio/i18n';
import { cn } from '@wpsocio/ui/lib/utils';
import {
	RenderTestResult,
	type RenderTestResultProps,
} from './render-test-result.js';

export type MemberCountResultProps = RenderTestResultProps & {
	chatId?: string;
};

export const MemberCountResult: React.FC<MemberCountResultProps> = ({
	chatId,
	...props
}) => {
	return (
		<RenderTestResult {...props} title={__('Members Count:')}>
			{({ result, resultType }) => (
				<div className="flex flex-wrap gap-3">
					<div className="min-w-[150px]">
						<span className="font-semibold">{chatId}</span>
					</div>
					<span
						className={cn('font-semibold', {
							'text-green-600': resultType === 'SUCCESS',
						})}
					>
						{result}
					</span>
				</div>
			)}
		</RenderTestResult>
	);
};
