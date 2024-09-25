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
	headerClassName?: string;
	contentClassName?: string;
};

export function Card({
	title,
	description,
	className,
	content,
	footer,
	children,
	titleClassName,
	headerClassName,
	contentClassName,
}: CardProps) {
	return (
		<CardUI
			className={cn('w-[350px] flex flex-col justify-between', className)}
		>
			{title || description ? (
				<CardHeader className={headerClassName}>
					{title ? (
						<CardTitle className={titleClassName}>{title}</CardTitle>
					) : null}
					{description ? (
						<CardDescription>{description}</CardDescription>
					) : null}
				</CardHeader>
			) : null}
			<CardContent className={contentClassName}>
				{content || children}
			</CardContent>
			{footer ? <CardFooter>{footer}</CardFooter> : null}
		</CardUI>
	);
}
