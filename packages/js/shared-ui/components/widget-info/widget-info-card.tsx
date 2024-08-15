import { __ } from '@wpsocio/i18n';
import { cn } from '@wpsocio/ui-components';
import { useMediaQuery } from '@wpsocio/ui-components/hooks/useMediaQuery.js';
import { Accordion } from '@wpsocio/ui-components/wrappers/accordion.js';

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
						<div className={cn('flex flex-col gap-4', className)}>
							{children}
						</div>
					),
				},
			]}
		/>
	);
};
