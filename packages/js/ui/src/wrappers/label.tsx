import * as React from 'react';
import { Label as LabelUI } from '../components/label.js';
import { cn } from '../lib/utils.js';

export type LabelProps = React.ComponentProps<typeof LabelUI> & {
	isRequired?: boolean;
};

export const Label = React.forwardRef<HTMLLabelElement, LabelProps>(
	({ children, isRequired, ...props }, ref) => {
		return (
			<LabelUI
				ref={ref}
				{...props}
				className={cn('text-base', props.className)}
			>
				{/** biome-ignore lint/complexity/noUselessFragments: We need a single child here */}
				<>
					{children}
					{isRequired && (
						<span
							role="presentation"
							aria-hidden="true"
							className="text-destructive ms-1"
						>
							{'*'}
						</span>
					)}
				</>
			</LabelUI>
		);
	},
);

Label.displayName = 'Label';
