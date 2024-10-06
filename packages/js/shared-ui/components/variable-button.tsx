import { __ } from '@wpsocio/i18n';
import { Tooltip } from '@wpsocio/ui-components/wrappers/tooltip.js';
import { useClipboard } from '@wpsocio/utilities/hooks/useClipboard.js';
import { Code } from './code.js';

export type VariableButtonProps = {
	content?: string;
	buttonClassName?: string;
	codeClassName?: string;
	children?: string;
};

export function VariableButton({
	content,
	children,
	buttonClassName,
	codeClassName,
}: VariableButtonProps) {
	const value = content || children || '';

	const { onCopy, hasCopied } = useClipboard(value);

	return (
		<Tooltip
			content={__('Copied!')}
			trigger={
				<button type="button" onClick={onCopy} className={buttonClassName}>
					<Code className={codeClassName}>{value}</Code>
				</button>
			}
			open={hasCopied}
		/>
	);
}
