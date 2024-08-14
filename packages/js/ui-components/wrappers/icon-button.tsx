import * as React from 'react';
import { cn } from '../lib/utils.js';
import type { ButtonProps } from './button.js';
import { Button } from './button.js';

export type IconButtonProps = ButtonProps & {
	icon?: React.ReactNode;
};

export const IconButton = React.forwardRef<HTMLButtonElement, IconButtonProps>(
	({ children, icon, className, ...props }, ref) => {
		return (
			<Button ref={ref} className={cn('px-2', className)} {...props}>
				{icon || children}
			</Button>
		);
	}
);

IconButton.displayName = 'IconButton';
