import { __ } from '@wpsocio/i18n';
import { Tooltip } from '@wpsocio/ui-components/wrappers/tooltip.js';
import { useClipboard } from '@wpsocio/utilities/hooks/useClipboard.js';
import { Code } from './code.js';

export type VariableButtonProps = {
	content: string;
	buttonClassName?: string;
	codeClassName?: string;
};

export function VariableButton({
	content,
	buttonClassName,
	codeClassName,
}: VariableButtonProps) {
	const { onCopy, hasCopied } = useClipboard(content);

	return (
		<Tooltip
			content={__('Copied!')}
			trigger={
				<button type="button" onClick={onCopy} className={buttonClassName}>
					<Code className={codeClassName}>{content}</Code>
				</button>
			}
			open={hasCopied}
		/>
	);
}
