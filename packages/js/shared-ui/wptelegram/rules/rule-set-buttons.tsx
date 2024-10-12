import { __ } from '@wpsocio/i18n';
import { Close, Plus } from '@wpsocio/ui-components/icons';
import { IconButton } from '@wpsocio/ui-components/wrappers/icon-button.js';

export type RuleSetButtonsProps = {
	onAdd: VoidFunction;
	onRemove: VoidFunction;
};

export const RuleSetButtons: React.FC<RuleSetButtonsProps> = ({
	onAdd,
	onRemove,
}) => {
	return (
		<div className="flex flex-row md:flex-col max-w-max justify-center gap-2">
			<IconButton
				aria-label={__('Remove this rule')}
				icon={<Close />}
				onClick={onRemove}
				title={__('Remove this rule')}
				variant="outline"
				className="text-destructive"
			/>
			<IconButton
				aria-label={__('Add another rule')}
				icon={<Plus />}
				onClick={onAdd}
				title={__('Add another rule')}
				variant="outline"
			/>
		</div>
	);
};
