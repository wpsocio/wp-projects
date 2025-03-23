import {
	TooltipContent,
	TooltipProvider,
	TooltipTrigger,
	Tooltip as TooltipUI,
} from '../components/tooltip.js';

export type TooltipProps = React.ComponentProps<typeof TooltipUI> & {
	trigger: React.ReactNode;
	content: React.ReactNode;
};

export function Tooltip({ trigger, content, ...props }: TooltipProps) {
	return (
		<TooltipProvider>
			<TooltipUI {...props}>
				<TooltipTrigger asChild>{trigger}</TooltipTrigger>
				<TooltipContent>{content}</TooltipContent>
			</TooltipUI>
		</TooltipProvider>
	);
}
