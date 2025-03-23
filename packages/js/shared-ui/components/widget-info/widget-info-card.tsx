import { __ } from '@wpsocio/i18n';
import { cn } from '@wpsocio/ui/lib/utils';
import { useMediaQuery } from '@wpsocio/ui/hooks/useMediaQuery';
import { Accordion } from '@wpsocio/ui/wrappers/accordion';

export interface WidgetInfoCardProps {
	className?: string;
	title?: string;
}

export const WidgetInfoCard: React.FC<
	React.PropsWithChildren<WidgetInfoCardProps>
> = ({ children, className, title }) => {
	const isLargeScreen = useMediaQuery('(min-width: 768px)');

	return (
		<Accordion
			className={cn('border rounded-sm border-gray-200', className)}
			// Only open the accordion on large screens by default
			defaultOpen={isLargeScreen ? 'widget-info' : undefined}
			items={[
				{
					value: 'widget-info',
					trigger: title || __('Widget Info'),
					className: 'px-4',
					wrapperClassName: 'border-b-0',
					content: () => (
						<div className={cn('flex flex-col gap-4 text-base', className)}>
							{children}
						</div>
					),
				},
			]}
		/>
	);
};
