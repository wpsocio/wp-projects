import { __ } from '@wpsocio/i18n';
import { cn } from '@wpsocio/ui-components';
import { SectionCard, type SectionCardProps } from './section-card.js';

export interface InstructionsProps extends SectionCardProps {
	highContrast?: boolean;
}

export const Instructions: React.FC<Partial<InstructionsProps>> = ({
	children,
	highContrast,
	...rest
}) => {
	return (
		<SectionCard
			title={__('INSTRUCTIONS!')}
			headerClassName={cn(highContrast && 'bg-[#343a40] text-white')}
			className={cn(highContrast && 'border border-[#343a40]')}
			{...rest}
		>
			{children}
		</SectionCard>
	);
};
