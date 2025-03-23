import {
	PopoverContent,
	PopoverTrigger,
	Popover as PopoverUI,
} from '../components/popover.js';

export type PopoverProps = React.ComponentProps<typeof PopoverUI> & {
	trigger: React.ReactNode;
	content?: React.ReactNode;
	contentClassName?: string;
};

export function Popover({
	trigger,
	content,
	children,
	contentClassName,
	...props
}: PopoverProps) {
	return (
		<PopoverUI {...props}>
			<PopoverTrigger asChild>{trigger}</PopoverTrigger>
			<PopoverContent className={contentClassName}>
				{content || children}
			</PopoverContent>
		</PopoverUI>
	);
}
