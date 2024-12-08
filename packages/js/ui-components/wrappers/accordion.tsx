import { cn } from '../lib/utils.js';
import {
	AccordionContent,
	AccordionItem,
	AccordionTrigger,
	Accordion as AccordionUI,
} from '../ui/accordion.js';

type Content = React.ReactNode | ((value: string) => React.ReactNode);

export type AccordionItemProps = {
	value: string;
	trigger: React.ReactNode;
	children?: Content;
	content?: Content;
	className?: string;
	wrapperClassName?: string;
};

export type AccordionProps = Partial<
	Pick<React.ComponentProps<typeof AccordionUI>, 'type' | 'className'>
> & {
	items: Array<AccordionItemProps>;
	forceMountContent?: true;
	collapsible?: boolean;
	defaultOpen?: string;
};

export function Accordion({
	items,
	type = 'single',
	className,
	forceMountContent,
	collapsible = true,
	defaultOpen,
	...accordionProps
}: AccordionProps) {
	const props =
		type === 'single'
			? { type, collapsible, defaultValue: defaultOpen }
			: { type: 'multiple' as const };

	return (
		<AccordionUI
			{...accordionProps}
			className={cn('w-full', className)}
			{...props}
		>
			{items.map(
				({
					value,
					trigger,
					children,
					content,
					wrapperClassName,
					...headerProps
				}) => {
					const contentRenderer = content || children;
					const renderedContent =
						typeof contentRenderer === 'function'
							? contentRenderer(value)
							: contentRenderer;

					return (
						<AccordionItem
							key={value}
							value={value}
							className={wrapperClassName}
						>
							<AccordionTrigger {...headerProps}>{trigger}</AccordionTrigger>
							<AccordionContent forceMount={forceMountContent}>
								{renderedContent}
							</AccordionContent>
						</AccordionItem>
					);
				},
			)}
		</AccordionUI>
	);
}
