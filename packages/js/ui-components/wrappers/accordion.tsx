import { cn } from '../lib/utils.js';
import {
	Accordion as AccordionUI,
	AccordionContent,
	AccordionItem,
	AccordionTrigger,
	type AccordionHeaderProps,
} from '../ui/accordion.js';

type Content = React.ReactNode | ((value: string) => React.ReactNode);

export type AccordionItemProps = {
	value: string;
	trigger: React.ReactNode;
	children?: Content;
	content?: Content;
} & AccordionHeaderProps;

export type AccordionProps = Partial<Pick<React.ComponentProps<typeof AccordionUI>, 'type' | 'className'>> & {
	items: Array<AccordionItemProps>;
	forceMountContent?: true;
};

export function Accordion({ items, type = 'single', className, forceMountContent, ...accordionProps }: AccordionProps) {
	return (
		<AccordionUI
			type={type}
			collapsible={'single' === type ? true : undefined}
			className={cn('w-full', className)}
			{...accordionProps}
		>
			{items.map(({ value, trigger, children, content, ...headerProps }) => {
				const contentRenderer = content || children;
				const renderedContent =
					typeof contentRenderer === 'function' ? contentRenderer(value) : contentRenderer;

				return (
					<AccordionItem key={value} value={value}>
						<AccordionTrigger {...headerProps}>{trigger}</AccordionTrigger>
						<AccordionContent forceMount={forceMountContent}>{renderedContent}</AccordionContent>
					</AccordionItem>
				);
			})}
		</AccordionUI>
	);
}
