import { cn } from '@wpsocio/ui-components';
import {
	RenderTestResult,
	type RenderTestResultProps,
} from './render-test-result.js';

export type TestMessageResultProps = RenderTestResultProps & {
	chatId?: string;
};

export const TestMessageResult: React.FC<TestMessageResultProps> = ({
	chatId,
	...props
}) => {
	return (
		<RenderTestResult {...props}>
			{({ result, resultType }) => (
				<div className="flex flex-wrap gap-3">
					<div className="min-w-max">
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
