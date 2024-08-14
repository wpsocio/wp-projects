import { __ } from '@wpsocio/i18n';
import { cn } from '@wpsocio/ui-components';
import { SectionCard } from '../section-card.js';

export interface WidgetInfoCardProps {
	className?: string;
	title?: string;
}

export const WidgetInfoCard: React.FC<
	React.PropsWithChildren<WidgetInfoCardProps>
> = ({ children, className, title }) => {
	return (
		<SectionCard title={title || __('Widget Info')} bodyClassName="px-0 py-0">
			<div className={cn('flex flex-col gap-4', className)}>{children}</div>
		</SectionCard>
	);
};
