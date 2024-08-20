import type * as React from 'react';

import { cn } from '../lib/utils.js';
import {
	CardContent,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle,
	Card as CardUI,
} from '../ui/card.js';

export type CardProps = Omit<
	React.ComponentProps<typeof CardUI>,
	'content' | 'title'
> & {
	className?: string;
	title?: React.ReactNode;
	description?: React.ReactNode;
	content?: React.ReactNode;
	footer?: React.ReactNode;
	titleClassName?: string;
};

export function Card({
	title,
	description,
	className,
	content,
	footer,
	children,
	titleClassName,
}: CardProps) {
	return (
		<CardUI
			className={cn('w-[350px] flex flex-col justify-between', className)}
		>
			{title || description ? (
				<CardHeader>
					{title ? (
						<CardTitle className={titleClassName}>{title}</CardTitle>
					) : null}
					{description ? (
						<CardDescription>{description}</CardDescription>
					) : null}
				</CardHeader>
			) : null}
			<CardContent>{content || children}</CardContent>
			{footer ? <CardFooter>{footer}</CardFooter> : null}
		</CardUI>
	);
}
