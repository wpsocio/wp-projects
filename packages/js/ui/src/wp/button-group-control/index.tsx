import { Button, __experimentalGrid as Grid } from '@wordpress/components';
import { useCallback } from 'react';
import { FieldsetAsLabel } from '../fieldset-as-label/index.js';

type Option = {
	label: string;
	value: string;
};

export interface ButtonGroupControlProps {
	label?: React.ReactNode;
	options: Option[];
	value: string[];
	onChange: (newValue: string[]) => void;
}

/**
 * A multi-select toggle button group component with accessibility via fieldset/legend.
 */
export function ButtonGroupControl({
	label,
	options,
	value = [],
	onChange,
}: ButtonGroupControlProps) {
	const toggleValue = useCallback(
		(val: string) => {
			const newValue = value.includes(val)
				? value.filter((v) => v !== val)
				: [...value, val];
			onChange(newValue);
		},
		[value, onChange],
	);

	return (
		<FieldsetAsLabel label={label}>
			<Grid gap={0.5} columns={options.length} isInline>
				{options.map(({ label, value: optionValue }) => {
					const isSelected = value.includes(optionValue);

					return (
						<Button
							key={optionValue}
							// biome-ignore lint/a11y/useSemanticElements: <explanation>
							role="checkbox"
							aria-checked={isSelected}
							isPressed={isSelected}
							onClick={() => toggleValue(optionValue)}
							variant={isSelected ? 'primary' : 'secondary'}
						>
							{label}
						</Button>
					);
				})}
			</Grid>
		</FieldsetAsLabel>
	);
}
