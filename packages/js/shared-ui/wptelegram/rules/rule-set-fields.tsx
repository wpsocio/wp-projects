import { __ } from '@wpsocio/i18n';
import { FormControl, FormItem } from '@wpsocio/ui-components/wrappers/form.js';
import { Select } from '@wpsocio/ui-components/wrappers/select.js';
import type { OptionsType } from '@wpsocio/ui-components/wrappers/types.js';
import { FormField } from '../../form/form-field.js';
import { RuleSetValues, type RuleSetValuesProps } from './rule-set-values.js';

const getOperatorOptions = () => [
	{
		value: 'in',
		label: __('is in'),
	},
	{
		value: 'not_in',
		label: __('is not in'),
	},
];

export type RuleSetFieldsProps = RuleSetValuesProps & {
	rule_types: OptionsType;
};

export const RuleSetFields: React.FC<RuleSetFieldsProps> = (props) => {
	const { ruleset_name, rule, rule_types } = props;

	return (
		<div className="flex flex-wrap gap-2 flex-col md:flex-row w-full">
			<div className="grow-[2]">
				<FormField
					name={`${ruleset_name}.param`}
					defaultValue={rule.param}
					render={({ field }) => (
						<FormItem>
							<FormControl>
								<Select
									{...field}
									aria-label={__('Rule type')}
									onValueChange={field.onChange}
									defaultValue={field.value}
									options={rule_types}
									triggerClassName="w-full"
								/>
							</FormControl>
						</FormItem>
					)}
				/>
			</div>
			<div className="grow-[1]">
				<FormField
					name={`${ruleset_name}.operator`}
					defaultValue={rule.operator}
					render={({ field }) => (
						<FormItem>
							<FormControl>
								<Select
									{...field}
									aria-label={__('Rule operator')}
									onValueChange={field.onChange}
									defaultValue={field.value}
									options={getOperatorOptions()}
									triggerClassName="w-full"
								/>
							</FormControl>
						</FormItem>
					)}
				/>
			</div>
			<div className="basis-full">
				<RuleSetValues {...props} />
			</div>
		</div>
	);
};
