import { __ } from '@wpsocio/i18n';
import type { ResultType } from '@wpsocio/services/api-fetch/types.js';
import { cn } from '@wpsocio/ui/lib/utils';
import { Alert } from '@wpsocio/ui/wrappers/alert';

export interface RenderTestResultProps {
	title?: string;
	result?: React.ReactNode;
	resultType?: ResultType;
	children?: (
		props: Pick<RenderTestResultProps, 'result' | 'resultType'>,
	) => React.ReactNode;
	className?: string;
}

export const RenderTestResult: React.FC<RenderTestResultProps> = ({
	result,
	resultType,
	children,
	title,
	className,
}) => {
	if (!result) {
		return null;
	}

	const output = children?.({ result, resultType }) || (
		<div
			className={cn('font-semibold', {
				'text-green-600': resultType === 'SUCCESS',
			})}
		>
			{result}
		</div>
	);

	return output ? (
		<Alert
			title={title || __('Test Result:')}
			type={resultType === 'ERROR' ? 'error' : 'success'}
			className={cn('max-w-max mt-4', className)}
			titleClassName="font-normal mb-2"
		>
			{output}
		</Alert>
	) : null;
};
