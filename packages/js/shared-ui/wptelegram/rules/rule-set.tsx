import { cn } from '@wpsocio/ui/lib/utils';
import {
	RuleSetButtons,
	type RuleSetButtonsProps,
} from './rule-set-buttons.js';
import { RuleSetFields, type RuleSetFieldsProps } from './rule-set-fields.js';

export type RuleSetProps = RuleSetFieldsProps &
	RuleSetButtonsProps & {
		hasMultipleRules?: boolean;
	};

export const RuleSet: React.FC<RuleSetProps> = ({
	hasMultipleRules,
	onAdd,
	onRemove,
	...props
}) => {
	return (
		<div
			className={cn(
				'flex gap-2 flex-col md:flex-row items-center p-2 rounded',
				{
					'border p-2': hasMultipleRules,
				},
			)}
		>
			<RuleSetFields {...props} />
			<RuleSetButtons onAdd={onAdd} onRemove={onRemove} />
		</div>
	);
};
