import * as React from 'react';
import { Button as ButtonUI } from '../ui/button.js';
import { cn } from '../lib/utils.js';
import { Spinner } from './spinner.js';

export type ButtonProps = React.ComponentProps<typeof ButtonUI> & {
	isLoading?: boolean;
};

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
	({ children, isLoading, ...props }, ref) => {
		if (isLoading) {
			return (
				<ButtonUI type="button" ref={ref} {...props}>
					{isLoading && (
						<Spinner className={cn({ 'me-2': Boolean(children) })} />
					)}
					{children}
				</ButtonUI>
			);
		}

		return (
			<ButtonUI type="button" ref={ref} {...props}>
				{children}
			</ButtonUI>
		);
	},
);

Button.displayName = 'Button';
