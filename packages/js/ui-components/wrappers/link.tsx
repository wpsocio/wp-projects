import * as React from 'react';
import { cn } from '../lib/utils.js';

export type LinkProps = React.AnchorHTMLAttributes<HTMLAnchorElement> & {
	isExternal?: boolean;
};

export const Link = React.forwardRef<HTMLAnchorElement, LinkProps>(
	({ children, isExternal, className, ...props }, ref) => {
		return (
			<a
				className={cn('underline', className)}
				ref={ref}
				rel={isExternal ? 'noopener noreferrer' : undefined}
				target={isExternal ? '_blank' : undefined}
				{...props}
			>
				{children}
			</a>
		);
	}
);

Link.displayName = 'Link';
