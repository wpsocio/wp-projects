import { forwardRef, useId } from 'react';
import { cn } from '../lib/utils.js';
import {
	RadioGroupItem,
	RadioGroup as RadioGroupUI,
} from '../components/radio-group.js';
import { Label } from './label.js';
import type { OptionsType } from './types.js';

export type RadioGroupProps = React.ComponentProps<typeof RadioGroupUI> & {
	options: OptionsType;
	displayInline?: boolean;
};

export const RadioGroup = forwardRef<
	React.ElementRef<typeof RadioGroupUI>,
	RadioGroupProps
>(({ options, displayInline, ...props }, ref) => {
	const id = useId();

	return (
		<RadioGroupUI
			{...props}
			ref={ref}
			className={cn({
				'xl:grid-flow-col xl:gap-4': displayInline,
			})}
		>
			{options.map((option) => {
				const inputId = `${id}-${option.value}`;

				return (
					<div className="flex items-center space-x-2" key={inputId}>
						<RadioGroupItem value={option.value} id={inputId} />
						<Label
							htmlFor={inputId}
							className={cn('font-normal cursor-pointer', {
								'opacity-50 cursor-not-allowed': props.disabled,
							})}
						>
							{option.label}
						</Label>
					</div>
				);
			})}
		</RadioGroupUI>
	);
});

RadioGroup.displayName = 'RadioGroup';
