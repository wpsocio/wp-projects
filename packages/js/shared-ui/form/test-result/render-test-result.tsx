import { __ } from '@wpsocio/i18n';
import { cn } from '@wpsocio/ui-components';

export type ResultType = 'SUCCESS' | 'ERROR';

interface RenderTestResultProps {
	result: React.ReactNode;
	resultType: ResultType;
}

export const RenderTestResult: React.FC<RenderTestResultProps> = ({
	result,
	resultType,
}) => {
	return result ? (
		<div>
			<i className="text-gray-600">{__('Test Result:')}</i>
			&nbsp;
			<span
				className={cn('font-bold', {
					'text-red-600': resultType === 'ERROR',
					'text-green-600': resultType === 'SUCCESS',
				})}
			>
				{result}
			</span>
		</div>
	) : null;
};
