import { __ } from '@wpsocio/i18n';
import { cn } from '@wpsocio/ui-components';
import { Alert } from '@wpsocio/ui-components/wrappers/alert.js';

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
		<Alert
			title={__('Test Result:')}
			type={resultType === 'ERROR' ? 'error' : 'success'}
			className="max-w-max"
		>
			<span
				className={cn('font-bold', {
					'text-green-600': resultType === 'SUCCESS',
				})}
			>
				{result}
			</span>
		</Alert>
	) : null;
};
