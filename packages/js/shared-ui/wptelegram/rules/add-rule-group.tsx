import { __ } from '@wpsocio/i18n';
import { Plus } from '@wpsocio/ui-components/icons/index.js';
import { Button } from '@wpsocio/ui-components/wrappers/button.js';

type AddRuleGroupProps = {
	onAdd: VoidFunction;
};

export const AddRuleGroup: React.FC<AddRuleGroupProps> = ({ onAdd }) => {
	return (
		<Button onClick={onAdd} variant="outline">
			<Plus className="me-2" />
			{__('Add rule')}
		</Button>
	);
};
