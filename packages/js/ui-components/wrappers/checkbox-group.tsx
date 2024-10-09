import { useId } from 'react';
import { Checkbox } from '../ui/checkbox.js';
import { Label } from './label.js';
import type { OptionsType } from './types.js';

export type CheckboxGroupProps = React.HTMLAttributes<HTMLDivElement> & {
	options: OptionsType<React.ComponentProps<typeof Checkbox>>;
	name?: string;
	defaultCheckedItems?: Array<string>;
};

export function CheckboxGroup({
	options,
	name,
	defaultCheckedItems,
	...props
}: CheckboxGroupProps) {
	const id = useId();

	return (
		<div {...props} className="grid gap-2">
			{options.map(({ value, label, id: _id, ...option }, index) => {
				const inputId = _id || `${id}-${value}`;

				const isDefaultChecked = defaultCheckedItems?.includes(value);

				return (
					<div className="flex items-center flex-row gap-2" key={inputId}>
						<Checkbox
							value={value}
							id={inputId}
							name={name?.replaceAll('{{index}}', index.toString()) || name}
							defaultChecked={isDefaultChecked}
							{...option}
						/>
						<Label htmlFor={inputId} className="font-normal cursor-pointer">
							{label}
						</Label>
					</div>
				);
			})}
		</div>
	);
}
