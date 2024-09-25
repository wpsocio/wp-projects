import { __ } from '@wpsocio/i18n';
import { Tooltip } from '@wpsocio/ui-components/wrappers/tooltip.js';
import { useClipboard } from '@wpsocio/utilities/hooks/useClipboard.js';
import { Code } from './code.js';

export function VariableButton({
	content,
}: React.ButtonHTMLAttributes<HTMLButtonElement> & { content: string }) {
	const { onCopy, hasCopied } = useClipboard(content);

	return (
		<Tooltip
			content={__('Copied!')}
			trigger={
				<button type="button" onClick={onCopy}>
					<Code>{content}</Code>
				</button>
			}
			open={hasCopied}
		/>
	);
}
